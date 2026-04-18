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
import * as models from "powerbi-models";

// Licensing
import IVisualLicenseManager = powerbi.extensibility.IVisualLicenseManager;
import ServicePlanState = powerbi.ServicePlanState;

interface VisualSettings {
    chipSettings: {
        multiSelect: boolean;
        layout: string;
        chipHeight: number;
        chipRadius: number;
        fontSize: number;
        chipGap: number;
        chipPaddingH: number;
        defaultBg: string;
        defaultBorder: string;
        defaultText: string;
        activeBg: string;
        activeBorder: string;
        activeText: string;
        showSelectAll: boolean;
        selectAllLabel: string;
    };
}

export class Visual implements IVisual {
    private target: HTMLElement;
    private host: IVisualHost;
    private container: HTMLElement;
    private localizationManager: ILocalizationManager;
    private licenseManager: IVisualLicenseManager;
    private isPro: boolean = false;
    private selectedValues: Set<string> = new Set();
    private settings: VisualSettings;
    private dataView: DataView;
    private table: string;
    private column: string;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.target = options.element;
        this.localizationManager = options.host.createLocalizationManager();
        this.licenseManager = options.host.licenseManager;

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
            this.container.innerHTML = "";
            return;
        }

        this.updateSettings(this.dataView);
        this.render(options);
    }

    private updateSettings(dataView: DataView) {
        const objects = dataView.metadata.objects;
        const getValue = <T>(obj: any, prop: string, def: T): T => {
            if (obj && obj[prop] !== undefined) {
                const val = obj[prop];
                if (typeof val === "object" && val.solid) return val.solid.color;
                return val;
            }
            return def;
        };

        const cS = objects?.chipSettings;
        this.settings = {
            chipSettings: {
                multiSelect: getValue(cS, "multiSelect", false),
                layout: getValue(cS, "layout", "horizontal"),
                chipHeight: getValue(cS, "chipHeight", 34),
                chipRadius: getValue(cS, "chipRadius", 17),
                fontSize: getValue(cS, "fontSize", 12),
                chipGap: getValue(cS, "chipGap", 8),
                chipPaddingH: getValue(cS, "chipPaddingH", 16),
                defaultBg: getValue(cS, "defaultBg", "#F3F4F6"),
                defaultBorder: getValue(cS, "defaultBorder", "#E5E7EB"),
                defaultText: getValue(cS, "defaultText", "#374151"),
                activeBg: getValue(cS, "activeBg", "#378ADD"),
                activeBorder: getValue(cS, "activeBorder", "#378ADD"),
                activeText: getValue(cS, "activeText", "#FFFFFF"),
                showSelectAll: getValue(cS, "showSelectAll", true),
                selectAllLabel: getValue(cS, "selectAllLabel", this.localizationManager.getDisplayName("All"))
            }
        };
    }

    private render(options: VisualUpdateOptions) {
        this.container.innerHTML = "";
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

        const settings = this.settings.chipSettings;
        
        // CSS Variables for styling
        this.container.style.display = "flex";
        this.container.style.flexWrap = settings.layout === "horizontal" ? "wrap" : "nowrap";
        this.container.style.flexDirection = settings.layout === "horizontal" ? "row" : "column";
        this.container.style.gap = `${settings.chipGap}px`;
        this.container.style.padding = "8px";
        this.container.style.overflowY = "auto";
        this.container.style.height = "100%";

        // Freemium Limit
        let displayValues = values;
        const isLimited = !this.isPro && values.length > 12;
        if (isLimited) displayValues = values.slice(0, 12);

        // Select All Chip
        if (settings.showSelectAll) {
            const isActive = this.selectedValues.size === 0;
            this.container.appendChild(this.createChip(settings.selectAllLabel, null, isActive, true));
        }

        // Category Chips
        displayValues.forEach((val, i) => {
            const strVal = String(val);
            const isActive = this.selectedValues.has(strVal);
            this.container.appendChild(this.createChip(strVal, val, isActive, false));
        });

        // Watermark if limited
        if (isLimited || !this.isPro) {
            const wm = document.createElement("div");
            wm.className = "slicer-watermark";
            wm.innerText = isLimited ? this.localizationManager.getDisplayName("UpgradePro") : "tcviz.com";
            wm.style.fontSize = "10px";
            wm.style.color = "#FF4081";
            wm.style.fontWeight = "bold";
            wm.style.marginTop = "10px";
            wm.style.opacity = "0.7";
            this.container.appendChild(wm);
        }
    }

    private createChip(label: string, value: any, isActive: boolean, isAll: boolean): HTMLElement {
        const settings = this.settings.chipSettings;
        const chip = document.createElement("div");
        chip.className = "chip-item";
        chip.innerText = label;

        Object.assign(chip.style, {
            height: `${settings.chipHeight}px`,
            borderRadius: `${settings.chipRadius}px`,
            padding: `0 ${settings.chipPaddingH}px`,
            fontSize: `${settings.fontSize}px`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.2s ease",
            border: "1.5px solid",
            backgroundColor: isActive ? settings.activeBg : settings.defaultBg,
            borderColor: isActive ? settings.activeBorder : settings.defaultBorder,
            color: isActive ? settings.activeText : settings.defaultText,
            fontWeight: isActive ? "bold" : "normal"
        });

        chip.onclick = () => {
            if (isAll) {
                this.selectedValues.clear();
            } else {
                const strVal = String(value);
                if (settings.multiSelect) {
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

    public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration {
        const objectName = options.objectName;
        const instances: powerbi.VisualObjectInstance[] = [];

        if (objectName === "chipSettings") {
            instances.push({
                objectName: objectName,
                properties: {
                    multiSelect: this.settings.chipSettings.multiSelect,
                    layout: this.settings.chipSettings.layout,
                    chipHeight: this.settings.chipSettings.chipHeight,
                    chipRadius: this.settings.chipSettings.chipRadius,
                    fontSize: this.settings.chipSettings.fontSize,
                    chipGap: this.settings.chipSettings.chipGap,
                    chipPaddingH: this.settings.chipSettings.chipPaddingH,
                    defaultBg: this.settings.chipSettings.defaultBg,
                    defaultBorder: this.settings.chipSettings.defaultBorder,
                    defaultText: this.settings.chipSettings.defaultText,
                    activeBg: this.settings.chipSettings.activeBg,
                    activeBorder: this.settings.chipSettings.activeBorder,
                    activeText: this.settings.chipSettings.activeText,
                    showSelectAll: this.settings.chipSettings.showSelectAll,
                    selectAllLabel: this.settings.chipSettings.selectAllLabel
                },
                selector: null
            });
        }
        return instances;
    }
}
