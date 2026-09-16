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

    /** Claves de los valores seleccionados (ver valueKey). */
    private selectedValues: Set<string> = new Set();
    /** Valor original por clave: el filtro se construye con el tipo real, no con el texto. */
    private valuesByKey: Map<string, powerbi.PrimitiveValue> = new Map();
    private filterTarget: models.IFilterTarget = null;
    /** Clave del chip con tabindex=0 (roving tabindex); sobrevive al re-render. */
    private focusKey: string = null;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.target = options.element;
        this.localizationManager = options.host.createLocalizationManager();
        this.formattingSettingsService = new FormattingSettingsService(this.localizationManager);
        this.selectionManager = options.host.createSelectionManager();
        this.events = options.host.eventService;

        this.container = document.createElement("div");
        this.container.className = "chip-slicer-container";
        this.container.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));
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
        const SVG_NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(SVG_NS, "svg");
        const svgAttrs: Record<string, string> = {
            width: "36", height: "36", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
            "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round"
        };
        Object.keys(svgAttrs).forEach(k => svg.setAttribute(k, svgAttrs[k]));
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", "M4 6h16M4 12h10M4 18h6");
        svg.appendChild(path);
        icon.appendChild(svg);

        const text = document.createElement("p");
        text.className = "chip-landing-text";
        text.textContent = this.localizationManager.getDisplayName("LandingText");

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

        this.filterTarget = Visual.getFilterTarget(category.source);

        this.valuesByKey.clear();
        values.forEach(v => this.valuesByKey.set(Visual.valueKey(v), v));

        // Sync selected values from existing filter (bookmarks, sync slicers, report reload)
        this.selectedValues.clear();
        for (const f of (options.jsonFilters ?? [])) {
            const fv = (f as any).values;
            if (Array.isArray(fv)) {
                for (const v of fv) {
                    this.selectedValues.add(Visual.valueKey(v));
                }
            }
        }

        // Si el foco estaba dentro del visual, se restaura tras el swap
        const hadFocus = this.container.contains(document.activeElement);

        // Build layout in memory
        const isHorizontal = settings.layout.value.value === "horizontal";
        const root = document.createElement("div");
        root.className = "chip-slicer-inner";
        root.setAttribute("role", "listbox");
        root.setAttribute("aria-multiselectable", String(!!settings.multiSelect.value));
        root.setAttribute("aria-orientation", isHorizontal ? "horizontal" : "vertical");
        root.setAttribute("aria-label", category.source.displayName);
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
            this.selectionManager.showContextMenu({} as powerbi.visuals.ISelectionId, { x: e.clientX, y: e.clientY });
            e.preventDefault();
        };

        const chips: HTMLElement[] = [];

        // "All" chip
        if (settings.showSelectAll.value) {
            const label = settings.selectAllLabel.value || this.localizationManager.getDisplayName("All");
            chips.push(this.createChip(label, Visual.ALL_KEY, this.selectedValues.size === 0, true, null, settings, isHighContrast));
        }

        // Category chips
        const blankLabel = this.localizationManager.getDisplayName("Blank");
        values.forEach((val, i) => {
            const key = Visual.valueKey(val);
            const label = val === null || val === undefined || val === "" ? blankLabel : Visual.valueLabel(val);
            const selId = this.host.createSelectionIdBuilder().withCategory(category, i).createSelectionId();
            chips.push(this.createChip(label, key, this.selectedValues.has(key), false, selId, settings, isHighContrast));
        });

        // Roving tabindex: una sola parada de Tab para todo el slicer
        const focusChip = chips.find(c => c.dataset.key === this.focusKey)
            ?? chips.find(c => c.getAttribute("aria-selected") === "true")
            ?? chips[0];
        chips.forEach(c => {
            c.tabIndex = c === focusChip ? 0 : -1;
            root.appendChild(c);
        });
        this.focusKey = focusChip?.dataset.key ?? null;

        // Atomic swap — build complete before touching the DOM
        this.swapContent(root);
        if (hadFocus && focusChip) {
            focusChip.focus();
        }
    }

    // ─── Chip factory ────────────────────────────────────────────────────────────

    private createChip(
        label: string,
        key: string,
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
        chip.dataset.key = key;
        chip.setAttribute("role", "option");
        chip.setAttribute("aria-selected", String(isActive));

        // Resolve colors — honour high contrast
        let bg: string, borderColor: string, textColor: string;
        if (isHighContrast) {
            const palette = this.host.colorPalette as any;
            const fg = palette.foreground?.value ?? "#FFFFFF";
            const bk = palette.background?.value ?? "#000000";
            const sel = palette.foregroundSelected?.value ?? fg;
            bg = isActive ? sel : bk;
            borderColor = isActive ? sel : fg;
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

        chip.onclick = (e: MouseEvent) => this.toggle(key, isAll, settings.multiSelect.value || e.ctrlKey || e.metaKey);

        chip.oncontextmenu = (e: MouseEvent) => {
            this.selectionManager.showContextMenu(selectionId, { x: e.clientX, y: e.clientY });
            e.preventDefault();
        };

        return chip;
    }

    // ─── Selection & keyboard ────────────────────────────────────────────────────

    private static readonly ALL_KEY = "\u0000all";

    private toggle(key: string, isAll: boolean, multi: boolean): void {
        if (!this.interactionsAllowed()) {
            return;
        }
        this.focusKey = key;
        if (isAll) {
            this.selectedValues.clear();
        } else if (multi) {
            if (this.selectedValues.has(key)) this.selectedValues.delete(key);
            else this.selectedValues.add(key);
        } else if (this.selectedValues.has(key) && this.selectedValues.size === 1) {
            // Single-select: click same chip again to deselect
            this.selectedValues.clear();
        } else {
            this.selectedValues.clear();
            this.selectedValues.add(key);
        }
        this.applyFilter();
    }

    private onKeyDown(e: KeyboardEvent): void {
        const chips = Array.from(this.container.querySelectorAll<HTMLElement>(".chip-item"));
        const current = (e.target as HTMLElement).closest?.(".chip-item") as HTMLElement;
        if (!current || chips.length === 0) {
            return;
        }
        const idx = chips.indexOf(current);
        let next = -1;
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                next = Math.min(idx + 1, chips.length - 1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                next = Math.max(idx - 1, 0);
                break;
            case "Home":
                next = 0;
                break;
            case "End":
                next = chips.length - 1;
                break;
            case "Enter":
            case " ": {
                e.preventDefault();
                const multi = this.formattingSettings?.chipSettingsCard.multiSelect.value || e.ctrlKey || e.metaKey;
                this.toggle(current.dataset.key, current.dataset.key === Visual.ALL_KEY, multi);
                return;
            }
            case "Escape":
                if (this.selectedValues.size > 0) {
                    e.preventDefault();
                    this.toggle(Visual.ALL_KEY, true, false);
                }
                return;
            case "ContextMenu":
            case "F10": {
                if (e.key === "F10" && !e.shiftKey) {
                    return;
                }
                e.preventDefault();
                const r = current.getBoundingClientRect();
                this.selectionManager.showContextMenu({} as powerbi.visuals.ISelectionId, { x: r.left, y: r.bottom });
                return;
            }
            default:
                return;
        }
        e.preventDefault();
        if (next !== idx) {
            current.tabIndex = -1;
            chips[next].tabIndex = 0;
            chips[next].focus();
            this.focusKey = chips[next].dataset.key;
        }
    }

    private interactionsAllowed(): boolean {
        const host = this.host as any;
        const allowed = host.hostCapabilities?.allowInteractions ?? host.allowInteractions;
        return allowed !== false;
    }

    // ─── Filter logic ────────────────────────────────────────────────────────────

    private applyFilter(): void {
        if (this.selectedValues.size === 0 || !this.filterTarget) {
            this.host.applyJsonFilter(null, "general", "filter", FilterAction.remove);
            return;
        }

        // Valores con su tipo original: "08001" sigue siendo texto, 2024 sigue siendo número
        const filterValues = Array.from(this.selectedValues)
            .filter(k => this.valuesByKey.has(k))
            .map(k => Visual.filterValue(this.valuesByKey.get(k)));

        const filter = new models.BasicFilter(this.filterTarget, "In", filterValues as any);
        this.host.applyJsonFilter(filter, "general", "filter", FilterAction.merge);
    }

    /** Clave estable por valor: igual para el valor del dataView y el que vuelve en jsonFilters. */
    private static valueKey(v: any): string {
        if (v === null || v === undefined) return "\u0000blank";
        if (v instanceof Date) return v.toJSON();
        return String(v);
    }

    private static filterValue(v: powerbi.PrimitiveValue): any {
        return v instanceof Date ? v.toJSON() : v;
    }

    private static valueLabel(v: powerbi.PrimitiveValue): string {
        return v instanceof Date ? v.toLocaleDateString() : String(v);
    }

    /**
     * Destino del filtro a partir de la expresión de la columna. Partir queryName por el
     * primer punto falla con tablas cuyo nombre lleva punto y con niveles de jerarquía.
     */
    private static getFilterTarget(source: powerbi.DataViewMetadataColumn): models.IFilterTarget {
        const expr: any = (source as any).expr;
        if (expr?.ref && expr?.source?.entity) {
            return { table: expr.source.entity, column: expr.ref };
        }
        if (expr?.level && expr?.arg?.hierarchy) {
            const inner = expr.arg.arg;
            const entity = inner?.source?.entity ?? inner?.arg?.source?.entity;
            if (entity) {
                return { table: entity, hierarchy: expr.arg.hierarchy, hierarchyLevel: expr.level };
            }
        }
        const queryName = source.queryName ?? "";
        const dot = queryName.indexOf(".");
        return dot > -1
            ? { table: queryName.substring(0, dot), column: queryName.substring(dot + 1) }
            : null;
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
