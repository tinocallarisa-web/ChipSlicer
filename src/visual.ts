"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import FilterAction = powerbi.FilterAction;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import * as models from "powerbi-models";

// Formatting Model
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualSettingsModel, ChipSettingsCard } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private host: IVisualHost;
    private container: HTMLElement;
    private localizationManager: ILocalizationManager;
    private formattingSettingsService: FormattingSettingsService;
    private formattingSettings: VisualSettingsModel;
    private selectionManager: ISelectionManager;
    private events: IVisualEventService;

    private selectedValues: Set<string> = new Set();
    private table: string = "";
    private column: string = "";

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.target = options.element;
        this.localizationManager = options.host.createLocalizationManager();
        this.formattingSettingsService = new FormattingSettingsService();
        this.selectionManager = options.host.createSelectionManager();
        this.events = options.host.eventService;

        this.container = document.createElement("div");
        this.container.className = "chip-slicer-container";
        this.target.appendChild(this.container);
    }

    public update(options: VisualUpdateOptions): void {
        this.events.renderingStarted(options);
        try {
            const dataView = options.dataViews?.[0];

            if (!dataView?.categorical?.categories?.length) {
                this.renderLandingPage();
                this.events.renderingFinished(options);
                return;
            }

            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
                VisualSettingsModel,
                dataView
            );

            this.render(options, dataView);
            this.events.renderingFinished(options);
        } catch (e) {
            this.events.renderingFailed(options, String(e));
        }
    }

    // ─── Landing page ────────────────────────────────────────────────────────────

    private renderLandingPage(): void {
        const root = document.createElement("div");
        root.className = "chip-landing-page";

        const icon = document.createElement("div");
        icon.className = "chip-landing-icon";
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 6h16M4 12h10M4 18h6"/>
            </svg>`;

        const text = document.createElement("p");
        text.className = "chip-landing-text";
        text.textContent = "Add a field to the Category well to start filtering.";

        root.appendChild(icon);
        root.appendChild(text);

        this.swapContent(root);
    }

    // ─── Main render ─────────────────────────────────────────────────────────────

    private render(options: VisualUpdateOptions, dataView: powerbi.DataView): void {
        const category = dataView.categorical!.categories![0];
        const values = category.values;
        const settings = this.formattingSettings.chipSettingsCard;
        const isHighContrast = this.host.colorPalette.isHighContrast;

        // Extract table.column for filter target
        const queryName = category.source.queryName ?? "";
        const dot = queryName.indexOf(".");
        this.table = dot > -1 ? queryName.substring(0, dot) : queryName;
        this.column = dot > -1 ? queryName.substring(dot + 1) : category.source.displayName;

        // Sync selected values from existing filter
        this.selectedValues.clear();
        for (const f of (options.jsonFilters ?? [])) {
            if ((f as any).values) {
                for (const v of (f as any).values) {
                    this.selectedValues.add(String(v));
                }
            }
        }

        // Build layout in memory
        const isHorizontal = settings.layout.value.value === "horizontal";
        const root = document.createElement("div");
        root.className = "chip-slicer-inner";
        Object.assign(root.style, {
            display: "flex",
            flexDirection: isHorizontal ? "row" : "column",
            flexWrap: isHorizontal ? "wrap" : "nowrap",
            alignContent: "flex-start",
            gap: `${settings.chipGap.value}px`,
            padding: "8px",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            overflowY: "auto",
            overflowX: "hidden"
        });

        root.oncontextmenu = (e: MouseEvent) => {
            this.selectionManager.showContextMenu(null, { x: e.clientX, y: e.clientY });
            e.preventDefault();
        };

        // "All" chip
        if (settings.showSelectAll.value) {
            const label = settings.selectAllLabel.value || this.localizationManager.getDisplayName("All");
            root.appendChild(
                this.createChip(label, null, this.selectedValues.size === 0, true, null, settings, isHighContrast)
            );
        }

        // Category chips
        values.forEach((val, i) => {
            const strVal = String(val);
            const selId = this.host.createSelectionIdBuilder().withCategory(category, i).createSelectionId();
            root.appendChild(
                this.createChip(strVal, val, this.selectedValues.has(strVal), false, selId, settings, isHighContrast)
            );
        });

        // Atomic swap — build complete before touching the DOM
        this.swapContent(root);
    }

    // ─── Chip factory ────────────────────────────────────────────────────────────

    private createChip(
        label: string,
        value: any,
        isActive: boolean,
        isAll: boolean,
        selectionId: powerbi.visuals.ISelectionId | null,
        settings: ChipSettingsCard,
        isHighContrast: boolean
    ): HTMLElement {
        const chip = document.createElement("div");
        chip.className = `chip-item${isActive ? " active" : ""}${isAll ? " chip-all" : ""}`;
        chip.textContent = label;
        chip.title = label;
        chip.setAttribute("role", "option");
        chip.setAttribute("aria-selected", String(isActive));
        chip.setAttribute("tabindex", "0");

        // Resolve colors — honour high contrast
        let bg: string, borderColor: string, textColor: string;
        if (isHighContrast) {
            const fg = (this.host.colorPalette as any).foreground?.value ?? "#FFFFFF";
            const bk = (this.host.colorPalette as any).background?.value ?? "#000000";
            bg = isActive ? fg : bk;
            borderColor = fg;
            textColor = isActive ? bk : fg;
        } else {
            bg = isActive ? settings.activeBg.value.value : settings.defaultBg.value.value;
            borderColor = isActive ? settings.activeBorder.value.value : settings.defaultBorder.value.value;
            textColor = isActive ? settings.activeText.value.value : settings.defaultText.value.value;
        }

        Object.assign(chip.style, {
            height: `${settings.chipHeight.value}px`,
            borderRadius: `${settings.chipRadius.value}px`,
            padding: `0 ${settings.chipPaddingH.value}px`,
            fontSize: `${settings.fontSize.value}px`,
            fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: isActive ? "600" : "400",
            letterSpacing: "0.01em",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            cursor: "pointer",
            userSelect: "none",
            border: `1.5px solid ${borderColor}`,
            backgroundColor: bg,
            color: textColor,
            boxShadow: isActive ? "none" : "0 1px 2px rgba(0,0,0,0.07)",
            transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease"
        });

        const handleClick = (): void => {
            if (isAll) {
                this.selectedValues.clear();
            } else {
                const strVal = String(value);
                if (settings.multiSelect.value) {
                    if (this.selectedValues.has(strVal)) this.selectedValues.delete(strVal);
                    else this.selectedValues.add(strVal);
                } else {
                    // Single-select: click same chip again to deselect
                    if (this.selectedValues.has(strVal) && this.selectedValues.size === 1) {
                        this.selectedValues.clear();
                    } else {
                        this.selectedValues.clear();
                        this.selectedValues.add(strVal);
                    }
                }
            }
            this.applyFilter();
        };

        chip.onclick = handleClick;

        chip.onkeydown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
            }
        };

        chip.oncontextmenu = (e: MouseEvent) => {
            this.selectionManager.showContextMenu(selectionId, { x: e.clientX, y: e.clientY });
            e.preventDefault();
        };

        return chip;
    }

    // ─── Filter logic ────────────────────────────────────────────────────────────

    private applyFilter(): void {
        if (this.selectedValues.size === 0) {
            this.host.applyJsonFilter(null, "general", "filter", FilterAction.merge);
            return;
        }

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

    // ─── DOM helpers ─────────────────────────────────────────────────────────────

    /** Replaces container content atomically — no blank flash mid-render. */
    private swapContent(newRoot: HTMLElement): void {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(newRoot);
    }

    // ─── Formatting model ────────────────────────────────────────────────────────

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
