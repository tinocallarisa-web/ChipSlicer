"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import FilterAction = powerbi.FilterAction;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionId = powerbi.visuals.ISelectionId;
import * as models from "powerbi-models";

// Formatting Model
import { formattingSettings, FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualSettingsModel } from "./settings";

// Licensing
import IVisualLicenseManager = powerbi.extensibility.IVisualLicenseManager;
import ServicePlanState = powerbi.ServicePlanState;

export class Visual implements IVisual {
    private target: HTMLElement;
    private host: IVisualHost;
    private container: HTMLElement;
    private localizationManager: ILocalizationManager;
    private licenseManager: IVisualLicenseManager;
    private formattingSettingsService: FormattingSettingsService;
    private formattingSettings: VisualSettingsModel;
    private selectionManager: ISelectionManager;

    private isPro: boolean = false;
    private selectedValues: Set<string> = new Set();
    private dataView: DataView;
    private table: string;
    private column: string;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.target = options.element;
        this.localizationManager = options.host.createLocalizationManager();
        this.licenseManager = options.host.licenseManager;
        this.formattingSettingsService = new FormattingSettingsService();
        this.selectionManager = options.host.createSelectionManager();

        this.container = document.createElement("div");
        this.container.className = "chip-slicer-container";
        this.target.appendChild(this.container);
    }

    public async update(options: VisualUpdateOptions) {
        try {
            const licenseResult = await this.licenseManager.getAvailableServicePlans();
            this.isPro = licenseResult.plans && licenseResult.plans.some(plan => plan.state === ServicePlanState.Active);
        } catch (e) {
            this.isPro = false;
        }

        this.dataView = options.dataViews[0];
        if (!this.dataView || !this.dataView.categorical || !this.dataView.categorical.categories) {
            this.container.replaceChildren();
            return;
        }

        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualSettingsModel, this.dataView);
        this.render(options);
    }

    private render(options: VisualUpdateOptions) {
        this.container.replaceChildren();
        const category = this.dataView.categorical.categories[0];
        const values = category.values;

        // Target extraction
        const queryName = category.source.queryName || "";
        const dotIndex = queryName.indexOf(".");
        this.table = dotIndex > -1 ? queryName.substring(0, dotIndex) : queryName;
        this.column = dotIndex > -1 ? queryName.substring(dotIndex + 1) : category.source.displayName;

        // Sync selected values from filter
        this.selectedValues.clear();
        const jsonFilters = options.jsonFilters || [];
        for (const filter of jsonFilters) {
            if ((<any>filter).values) {
                for (const val of (<any>filter).values) {
                    this.selectedValues.add(String(val));
                }
            }
        }

        const settings = this.formattingSettings.chipSettingsCard;

        // CSS Variables for styling
        this.container.style.display = "flex";
        this.container.style.flexWrap = settings.layout.value.value === "horizontal" ? "wrap" : "nowrap";
        this.container.style.flexDirection = settings.layout.value.value === "horizontal" ? "row" : "column";
        this.container.style.gap = `${settings.chipGap.value}px`;
        this.container.style.padding = "8px";
        this.container.style.overflowY = "auto";
        this.container.style.height = "100%";

        // Context menu on empty space
        this.container.oncontextmenu = (e: MouseEvent) => {
            const position: powerbi.extensibility.IPoint = {
                x: e.clientX,
                y: e.clientY
            };
            this.selectionManager.showContextMenu(null, position);
            e.preventDefault();
        };

        // Freemium Limit: free users see up to 5 values
        let displayValues = values;
        const isLimited = !this.isPro && values.length > 12;
        if (isLimited) displayValues = values.slice(0, 12);

        // Select All Chip
        if (settings.showSelectAll.value) {
            const isActive = this.selectedValues.size === 0;
            const label = settings.selectAllLabel.value || this.localizationManager.getDisplayName("All");
            this.container.appendChild(this.createChip(label, null, isActive, true, null));
        }

        // Category Chips
        displayValues.forEach((val, i) => {
            const strVal = String(val);
            const isActive = this.selectedValues.has(strVal);

            // Create SelectionId for context menu and filtering
            const selectionId = this.host.createSelectionIdBuilder()
                .withCategory(category, i)
                .createSelectionId();

            this.container.appendChild(this.createChip(strVal, val, isActive, false, selectionId));
        });

        // FIXED: Watermark only shown when free tier limit is actually reached.
        // Previously showed "tcviz.com" even when no limit was applied, which
        // Microsoft AppSource reviewers flag as intrusive advertising.
        if (isLimited) {
            const wm = document.createElement("div");
            wm.className = "slicer-watermark";
            wm.innerText = this.localizationManager.getDisplayName("UpgradePro");
            wm.style.fontSize = "10px";
            wm.style.color = "#FF4081";
            wm.style.fontWeight = "bold";
            wm.style.marginTop = "10px";
            wm.style.opacity = "0.7";
            this.container.appendChild(wm);
        }
    }

    private createChip(label: string, value: any, isActive: boolean, isAll: boolean, selectionId: powerbi.visuals.ISelectionId): HTMLElement {
        const settings = this.formattingSettings.chipSettingsCard;
        const chip = document.createElement("div");
        chip.className = "chip-item";
        chip.innerText = label;
        chip.title = label;

        Object.assign(chip.style, {
            height: `${settings.chipHeight.value}px`,
            borderRadius: `${settings.chipRadius.value}px`,
            padding: `0 ${settings.chipPaddingH.value}px`,
            fontSize: `${settings.fontSize.value}px`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.2s ease",
            border: "1.5px solid",
            backgroundColor: isActive ? settings.activeBg.value.value : settings.defaultBg.value.value,
            borderColor: isActive ? settings.activeBorder.value.value : settings.defaultBorder.value.value,
            color: isActive ? settings.activeText.value.value : settings.defaultText.value.value,
            fontWeight: isActive ? "bold" : "normal"
        });

        chip.onclick = (e) => {
            if (isAll) {
                this.selectedValues.clear();
            } else {
                const strVal = String(value);
                if (settings.multiSelect.value) {
                    if (this.selectedValues.has(strVal)) this.selectedValues.delete(strVal);
                    else this.selectedValues.add(strVal);
                } else {
                    if (this.selectedValues.has(strVal) && this.selectedValues.size === 1) this.selectedValues.clear();
                    else {
                        this.selectedValues.clear();
                        this.selectedValues.add(strVal);
                    }
                }
            }
            this.applyFilter();
        };

        // Context Menu support
        chip.oncontextmenu = (e: MouseEvent) => {
            this.selectionManager.showContextMenu(selectionId, {
                x: e.clientX,
                y: e.clientY
            });
            e.preventDefault();
        };

        return chip;
    }

    private applyFilter() {
        if (this.selectedValues.size === 0) {
            this.host.applyJsonFilter(null, "general", "filter", FilterAction.merge);
        } else {
            const filterValues = Array.from(this.selectedValues).map(v => {
                if (v === "true") return true;
                if (v === "false") return false;
                const n = Number(v);
                return isNaN(n) || v === "" ? v : n;
            });

            const filter = new models.BasicFilter(
                { table: this.table, column: this.column },
                "In",
                filterValues
            );

            this.host.applyJsonFilter(filter, "general", "filter", FilterAction.merge);
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
