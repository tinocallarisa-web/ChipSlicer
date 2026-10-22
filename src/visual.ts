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
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
import {
    HtmlSubSelectableClass, HtmlSubSelectionHelper, SubSelectableDisplayNameAttribute,
    SubSelectableObjectNameAttribute, SubSelectableTypeAttribute,
} from "powerbi-visuals-utils-onobjectutils";

// Formatting Model
import { FormattingSettingsService, formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { VisualSettingsModel, TEMPLATES } from "./settings";
import { STRINGS } from "./strings";
import { LANDING_ICON } from "./landingIcon";

const URL_GUIDE = "https://tinocallarisa-web.github.io/ChipSlicer/support.html";
const URL_PRODUCT = "https://tcviz.com/product/chip-slicer/?ref=visual-chip-slicer";
const URL_VIDEO = "https://www.youtube.com/watch?v=cbJ_VHPA5Sk";
const URL_HIERARCHY = "https://tcviz.com/product/chip-slicer-hierarchy/?ref=visual-chip-slicer";

/** Un chip: el valor original (para el filtro), su texto y, si hay medida, su valor. */
interface ChipItem {
    key: string;
    value: powerbi.PrimitiveValue;
    label: string;
    measure: number | null;
    measureText: string;
    selectionId: powerbi.visuals.ISelectionId;
    index: number;
}

export class Visual implements IVisual {
    private target: HTMLElement;
    private host: IVisualHost;
    private container: HTMLElement;
    private localizationManager: ILocalizationManager;
    private formattingSettingsService: FormattingSettingsService;
    private formattingSettings: VisualSettingsModel;
    private selectionManager: ISelectionManager;
    private events: IVisualEventService;
    private subSelectionHelper: HtmlSubSelectionHelper;
    public visualOnObjectFormatting: powerbi.extensibility.visual.VisualOnObjectFormatting;

    /** Claves de los valores seleccionados (ver valueKey). */
    private selectedValues: Set<string> = new Set();
    /** Valor original por clave: el filtro se construye con el tipo real, no con el texto. */
    private valuesByKey: Map<string, powerbi.PrimitiveValue> = new Map();
    private filterTarget: models.IFilterTarget = null;
    /** Clave del chip con tabindex=0 (roving tabindex); sobrevive al re-render. */
    private focusKey: string = null;
    private formatMode = false;
    private editing = false;
    private lastOptions: VisualUpdateOptions = null;
    private items: ChipItem[] = [];
    private categoryName = "";
    private measureName = "";
    /** Última plantilla vista: al cambiarla editando se aplica de verdad (aplicarPlantilla). */
    private tplVisto: string = null;
    /** Selección por defecto ya resuelta para este texto (ver applyDefaultSelection). */
    private defaultSig: string = null;
    private fmtCache = new Map<string, valueFormatter.IValueFormatter>();

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

        this.subSelectionHelper = HtmlSubSelectionHelper.createHtmlSubselectionHelper({
            hostElement: options.element,
            subSelectionService: options.host.subSelectionService,
            selectionIdCallback: () => undefined,
        });
        this.visualOnObjectFormatting = {
            getSubSelectionStyles: (subs) => this.getSubSelectionStyles(subs),
            getSubSelectionShortcuts: (subs) => this.getSubSelectionShortcuts(subs),
            getSubSelectables: (filter) => this.subSelectionHelper.getAllSubSelectables(filter),
        };
        // Los marcadores devuelven el filtro en jsonFilters (update); esto solo repinta los chips si llega antes.
        this.selectionManager.registerOnSelectCallback(() => this.renderList());
    }

    public update(options: VisualUpdateOptions): void {
        this.events.renderingStarted(options);
        try {
            this.lastOptions = options;
            const viewMode = (options as any).viewMode;
            this.editing = typeof viewMode === "number" && viewMode !== 0;
            this.formatMode = !!(options as any).formatMode;
            this.subSelectionHelper.setFormatMode(this.formatMode);
            this.container.classList.toggle("fmt", this.formatMode);

            const dataView = options.dataViews?.[0];
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualSettingsModel, dataView);

            if (!dataView?.categorical?.categories?.length) {
                this.renderLandingPage(options.viewport);
                this.events.renderingFinished(options);
                return;
            }

            const objs: any = dataView.metadata?.objects ?? {};
            const tpl = String(objs?.style?.template ?? "classic");
            this.applyTemplateDefaults(tpl, objs);
            if (this.editing && this.tplVisto !== null && this.tplVisto !== tpl) this.aplicarPlantilla(tpl);
            this.tplVisto = tpl;

            this.render(options, dataView);
            this.applyDefaultSelection(options);
            this.markSubSelectables();
            if (this.formatMode) this.subSelectionHelper.updateOutlinesFromSubSelections((options as any).subSelections ?? [], true);
            this.events.renderingFinished(options);
        } catch (e) {
            this.events.renderingFailed(options, String(e));
        }
    }

    // ─── Textos ──────────────────────────────────────────────────────────────────

    /** Texto por clave: primero la tabla del bundle (Desktop no traduce claves que no estén en capabilities). */
    private t(key: string, fallback: string): string {
        const loc = String(this.host?.locale || "");
        const tabla = STRINGS[loc] || STRINGS[Object.keys(STRINGS).find(l => l.slice(0, 2) === loc.slice(0, 2)) || ""];
        if (tabla && tabla[key]) return tabla[key];
        try {
            const s = this.localizationManager?.getDisplayName(key);
            return s && s !== key ? s : fallback;
        } catch { return fallback; }
    }

    /** Plantillas con "{0}". */
    private tf(key: string, fallback: string, ...args: string[]): string {
        return this.t(key, fallback).replace(/\{(\d+)\}/g, (_m, i) => args[Number(i)] ?? "");
    }

    // ─── Plantillas ──────────────────────────────────────────────────────────────

    /** Lo que el autor no ha fijado toma el valor de la plantilla. "classic" no cambia nada: es el aspecto de 1.4. */
    private applyTemplateDefaults(tpl: string, objs: any): void {
        const tp = TEMPLATES[tpl];
        if (!tp) return;
        const card = this.formattingSettings.chipSettingsCard;
        const slices: formattingSettings.SimpleSlice[] = [];
        card.groups.forEach(g => (g.slices ?? []).forEach(s => slices.push(s as formattingSettings.SimpleSlice)));
        Object.keys(tp).forEach(prop => {
            if (objs?.chipSettings?.[prop] !== undefined) return;
            const sl = slices.find(s => s.name === prop);
            if (!sl) return;
            sl.value = sl instanceof formattingSettings.ColorPicker ? { value: String(tp[prop]) } : tp[prop];
        });
    }

    /** Al ELEGIR una plantilla se borran los ajustes guardados que ella define, para que se vea. */
    private aplicarPlantilla(nombre: string): void {
        const tp = TEMPLATES[nombre] ?? {};
        const props = Object.keys(tp);
        if (!props.length) return;
        const properties = props.reduce((acc: any, p) => { acc[p] = null; return acc; }, {});
        this.host.persistProperties({ remove: [{ objectName: "chipSettings", selector: null, properties }] });
    }

    private persistir(objectName: string, properties: any): void {
        this.host.persistProperties({ merge: [{ objectName, selector: null as any, properties }] });
    }

    // ─── Landing page ────────────────────────────────────────────────────────────

    /** Pantalla de inicio de la serie TCViz, en tres tamaños. Los enlaces solo se abren con un clic (host.launchUrl). */
    private renderLandingPage(vp: powerbi.IViewport): void {
        const w = vp?.width || 0, h = vp?.height || 0;
        const size = (w >= 560 && h >= 300) ? "l" : (w >= 320 && h >= 200) ? "m" : "s";
        const pal: any = this.host.colorPalette;
        const hc = !!pal?.isHighContrast;
        const fg = hc ? (pal.foreground?.value || "#FFFFFF") : "";
        const el = document.createElement("div");
        el.className = "chip-landing chip-landing-" + size;
        if (hc) el.style.background = pal.background?.value || "#000000";
        const mk = (tag: string, cls?: string, text?: string): HTMLElement => {
            const n = document.createElement(tag);
            if (cls) n.className = cls;
            if (text !== undefined) n.textContent = text;
            if (fg) n.style.color = fg;
            return n;
        };
        const head = mk("div", "cl-head");
        const img = document.createElement("img");
        img.src = LANDING_ICON; img.alt = ""; img.className = "cl-icon";
        head.appendChild(img);
        const titles = mk("div");
        titles.appendChild(mk("div", "cl-title", "Chip Slicer"));
        if (size !== "s") titles.appendChild(mk("div", "cl-tag", this.t("Landing_Tagline", "Filter the page with one click. Free, no licence.")));
        head.appendChild(titles);
        el.appendChild(head);

        const link = (txt: string, url: string, cls: string, sub?: string): HTMLElement => {
            const a = mk("a", cls) as HTMLAnchorElement;
            a.href = url; a.tabIndex = 0;
            a.appendChild(document.createTextNode(txt));
            if (sub) a.appendChild(mk("span", "cl-sub", sub));
            if (hc) { a.style.background = "transparent"; a.style.borderColor = fg; }
            const open = (e: Event) => { e.preventDefault(); e.stopPropagation(); if (this.interactionsAllowed()) this.host.launchUrl(url); };
            a.addEventListener("click", open);
            a.addEventListener("keydown", (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") open(e); });
            return a;
        };
        const cat = this.t("Role_Category", "Category");
        if (size === "s") {
            el.appendChild(mk("p", "cl-do", this.t("LandingText", "Add a field to Category to start filtering.")));
            el.appendChild(link(this.t("Landing_Guide", "Guide"), URL_GUIDE, "cl-a"));
            this.swapContent(el);
            return;
        }
        const cols = mk("div", "cl-cols");
        const pasos = mk("div");
        pasos.appendChild(mk("div", "cl-lbl", this.t("Landing_Steps", "Get started")));
        const ol = mk("ol", "cl-steps");
        const paso = (n: string, b: string, txt: string) => {
            const li = mk("li");
            li.appendChild(mk("span", "cl-n", n));
            const s = mk("span");
            s.appendChild(mk("b", "cl-well", b));
            s.appendChild(document.createTextNode(" — " + txt));
            li.appendChild(s);
            ol.appendChild(li);
        };
        paso("1", cat, this.t("Landing_Step1", "the field to filter by: one chip per value"));
        paso("2", this.t("Role_Value", "Value (optional)"), this.t("Landing_Step2", "a count or total shown on each chip"));
        paso("3", this.t("style", "Style template"), this.t("Landing_Step3", "in the Format pane: pick a look in one click"));
        pasos.appendChild(ol);
        cols.appendChild(pasos);
        const links = mk("div");
        links.appendChild(mk("div", "cl-lbl", this.t("Landing_Help", "Help")));
        const ll = mk("div", "cl-links");
        ll.appendChild(link(this.t("Landing_Guide", "Guide"), URL_GUIDE, "cl-card", this.t("Landing_GuideSub", "support page")));
        ll.appendChild(link(this.t("Landing_Product", "Product page"), URL_PRODUCT, "cl-card", "tcviz.com"));
        if (size === "l") ll.appendChild(link(this.t("Landing_Video", "Video"), URL_VIDEO, "cl-card", "YouTube"));
        links.appendChild(ll);
        cols.appendChild(links);
        el.appendChild(cols);
        this.swapContent(el);
    }

    // ─── Datos ───────────────────────────────────────────────────────────────────

    private buildItems(dataView: powerbi.DataView): ChipItem[] {
        const category = dataView.categorical.categories[0];
        const mcol = dataView.categorical.values?.[0];
        const blankLabel = this.t("Blank", "(Blank)");
        const catFmt = this.categoryFormatter(category.source);
        const out: ChipItem[] = [];
        category.values.forEach((val, i) => {
            const m = mcol ? mcol.values[i] : null;
            const measure = typeof m === "number" && isFinite(m) ? m : null;
            out.push({
                key: Visual.valueKey(val),
                value: val,
                label: val === null || val === undefined || val === "" ? blankLabel : catFmt(val),
                measure,
                measureText: mcol && m !== null && m !== undefined ? this.formatValue(m, this.fmtOf(mcol, i)) : "",
                selectionId: this.host.createSelectionIdBuilder().withCategory(category, i).createSelectionId(),
                index: i
            });
        });
        const sort = String(this.formattingSettings.chipSettingsCard.selection.sort.value?.value ?? "data");
        const cmp = (a: ChipItem, b: ChipItem): number => {
            const x = a.value, y = b.value;
            if (x instanceof Date && y instanceof Date) return x.getTime() - y.getTime();
            if (typeof x === "number" && typeof y === "number") return x - y;
            return a.label.localeCompare(b.label, this.host.locale || undefined, { numeric: true, sensitivity: "base" });
        };
        if (sort === "asc") out.sort(cmp);
        else if (sort === "desc") out.sort((a, b) => cmp(b, a));
        else if (sort === "valueDesc" && mcol) out.sort((a, b) => ((b.measure ?? -Infinity) - (a.measure ?? -Infinity)) || a.index - b.index);
        return out;
    }

    /** Etiqueta de la categoría con el formato del modelo (fechas, números) y el idioma del informe. */
    private categoryFormatter(src: powerbi.DataViewMetadataColumn): (v: powerbi.PrimitiveValue) => string {
        let fmt: string | undefined;
        try { fmt = valueFormatter.getFormatStringByColumn(src as any) || src?.format || undefined; } catch { fmt = src?.format; }
        let f: valueFormatter.IValueFormatter = null;
        try { f = valueFormatter.create({ format: fmt, cultureSelector: this.host.locale }); } catch { f = null; }
        return (v) => {
            if (f && (typeof v === "number" || v instanceof Date)) {
                try { return f.format(v); } catch { /* cae al texto */ }
            }
            return v instanceof Date ? v.toLocaleDateString(this.host.locale || undefined) : String(v);
        };
    }

    /**
     * Formato de la medida en una fila: la cadena DINÁMICA si el DAX la decide (con general.formatString declarado en
     * capabilities, Power BI la manda en los objetos de cada fila), si no la de la columna.
     */
    private fmtOf(col: powerbi.DataViewValueColumn, i: number): string | undefined {
        const dyn = (col as any).objects?.[i]?.general?.formatString;
        if (typeof dyn === "string" && dyn) return dyn;
        try { return valueFormatter.getFormatStringByColumn(col.source as any) || col.source?.format || undefined; }
        catch { return col.source?.format ?? undefined; }
    }

    private formatValue(value: powerbi.PrimitiveValue, formatStr?: string): string {
        const key = formatStr ?? "";
        let f = this.fmtCache.get(key);
        if (!f) {
            try { f = valueFormatter.create({ format: formatStr || "#,0.##", cultureSelector: this.host.locale }); }
            catch { return String(value); }
            this.fmtCache.set(key, f);
        }
        return f.format(value);
    }

    // ─── Main render ─────────────────────────────────────────────────────────────

    private render(options: VisualUpdateOptions, dataView: powerbi.DataView): void {
        const category = dataView.categorical.categories[0];
        const s = this.formattingSettings;
        const sel = s.chipSettingsCard.selection, lay = s.chipSettingsCard.layoutGrp;
        const pal: any = this.host.colorPalette;
        const hc = !!pal?.isHighContrast;
        const fgHC = pal?.foreground?.value ?? "#FFFFFF";

        this.filterTarget = Visual.getFilterTarget(category.source);
        if (this.lastLocale !== this.host.locale) { this.fmtCache.clear(); this.lastLocale = this.host.locale; }
        this.items = this.buildItems(dataView);
        this.categoryName = category.source.displayName;
        this.measureName = dataView.categorical.values?.[0]?.source?.displayName ?? "";
        this.valuesByKey.clear();
        this.items.forEach(it => this.valuesByKey.set(it.key, it.value));

        // La selección sale del filtro guardado (marcadores, segmentaciones sincronizadas, recarga)
        this.selectedValues.clear();
        for (const f of (options.jsonFilters ?? [])) {
            const fv = (f as any).values;
            if (Array.isArray(fv)) fv.forEach(v => this.selectedValues.add(Visual.valueKey(v)));
        }

        const hadFocus = this.container.contains(document.activeElement);

        const root = document.createElement("div");
        root.className = "chip-root";

        // Cabecera y botón de limpiar
        const hasSel = this.selectedValues.size > 0;
        const showClear = !!sel.showClear.value && (hasSel || this.formatMode);
        let clearPlaced = false;
        if (s.headerCard.show.value) {
            const hd = document.createElement("div");
            hd.className = "chip-header";
            const tx = document.createElement("div");
            tx.className = "chip-header-text";
            tx.setAttribute("data-o", "header");
            tx.textContent = s.headerCard.text.value || category.source.displayName;
            Object.assign(tx.style, {
                fontFamily: s.headerCard.fontFamily.value,
                fontSize: `${s.headerCard.fontSize.value}px`,
                fontWeight: s.headerCard.bold.value ? "700" : "",
                color: hc ? fgHC : s.headerCard.color.value.value
            });
            hd.appendChild(tx);
            if (showClear) { hd.appendChild(this.clearButton(hc, fgHC)); clearPlaced = true; }
            root.appendChild(hd);
        }

        const list = document.createElement("div");
        list.className = "chip-slicer-inner";
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-multiselectable", String(!!sel.multiSelect.value));
        list.setAttribute("aria-label", category.source.displayName);
        list.oncontextmenu = (e: MouseEvent) => {
            if (this.formatMode) return;
            this.selectionManager.showContextMenu({} as powerbi.visuals.ISelectionId, { x: e.clientX, y: e.clientY });
            e.preventDefault();
        };
        root.appendChild(list);
        if (showClear && !clearPlaced) {
            const b = this.clearButton(hc, fgHC);
            b.classList.add("chip-clear-float");
            root.appendChild(b);
            root.classList.add("has-float-clear");
        }
        if (sel.showClear.value && !s.headerCard.show.value) root.classList.add("reserve-clear");

        const layout = String(lay.layout.value?.value ?? "horizontal");
        list.setAttribute("aria-orientation", layout === "vertical" ? "vertical" : "horizontal");
        this.swapContent(root);
        this.renderList();

        if (hadFocus) {
            (this.container.querySelector(".chip-item[tabindex='0']") as HTMLElement)?.focus();
        }
        this.renderGuide(options.viewport);
    }

    private lastLocale: string = null;

    /** Pinta los chips en la lista ya montada (también desde el callback de marcadores, sin reconstruir lo demás). */
    private renderList(): void {
        const list = this.container.querySelector(".chip-slicer-inner") as HTMLElement;
        if (!list) return;
        const s = this.formattingSettings;
        const sel = s.chipSettingsCard.selection, lay = s.chipSettingsCard.layoutGrp, chip = s.chipSettingsCard.chip;
        const layout = String(lay.layout.value?.value ?? "horizontal");
        const align = String(lay.align.value?.value ?? "left");
        const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
        const gap = lay.chipGap.value;
        Object.assign(list.style, { display: "", gridTemplateColumns: "", flexDirection: "", flexWrap: "", justifyContent: "", alignItems: "", overflowX: "", gap: `${gap}px` });
        if (layout === "grid") {
            const n = Math.round(lay.columns.value || 0);
            const minW = Math.max(56, chip.fontSize.value * 5 + chip.chipPaddingH.value * 2);
            Object.assign(list.style, { display: "grid", gridTemplateColumns: n > 0 ? `repeat(${n}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(${minW}px, 1fr))`, alignContent: "start" });
        } else if (layout === "vertical") {
            Object.assign(list.style, { display: "flex", flexDirection: "column", alignItems: lay.chipFill.value ? "stretch" : justify });
        } else {
            const wrap = !!lay.wrap.value;
            Object.assign(list.style, { display: "flex", flexDirection: "row", flexWrap: wrap ? "wrap" : "nowrap", justifyContent: justify, alignContent: "flex-start", overflowX: wrap ? "hidden" : "auto" });
        }

        const pal: any = this.host.colorPalette;
        const hc = !!pal?.isHighContrast;
        const chips: HTMLElement[] = [];
        if (sel.showSelectAll.value) {
            const label = sel.selectAllLabel.value || this.t("All", "All");
            chips.push(this.createChip(label, Visual.ALL_KEY, this.selectedValues.size === 0, true, null, "", hc, layout));
        }
        const badgeOn = !!s.badgeCard.show.value;
        this.items.forEach(it => {
            const c = this.createChip(it.label, it.key, this.selectedValues.has(it.key), false, it.selectionId, badgeOn ? it.measureText : "", hc, layout);
            this.bindTooltip(c, it);
            chips.push(c);
        });

        while (list.firstChild) list.removeChild(list.firstChild);
        // Roving tabindex: una sola parada de Tab para todo el slicer
        const focusChip = chips.find(c => c.dataset.key === this.focusKey)
            ?? chips.find(c => c.getAttribute("aria-selected") === "true")
            ?? chips[0];
        chips.forEach(c => { c.tabIndex = c === focusChip ? 0 : -1; list.appendChild(c); });
        this.focusKey = focusChip?.dataset.key ?? null;
        this.markSubSelectables();
    }

    // ─── Chip factory ────────────────────────────────────────────────────────────

    private createChip(label: string, key: string, isActive: boolean, isAll: boolean,
        selectionId: powerbi.visuals.ISelectionId | null, badge: string, hc: boolean, layout: string): HTMLElement {
        const s = this.formattingSettings;
        const c = s.chipSettingsCard.chip, col = s.chipSettingsCard.colors, lay = s.chipSettingsCard.layoutGrp;
        const el = document.createElement("div");
        el.className = `chip-item${isActive ? " active" : ""}${isAll ? " chip-all" : ""}`;
        el.title = badge ? `${label} · ${badge}` : label;
        el.dataset.key = key;
        el.setAttribute("role", "option");
        el.setAttribute("aria-selected", String(isActive));
        el.setAttribute("data-o", "chips");
        if (badge) el.setAttribute("aria-label", `${label}, ${badge}`);

        let bg: string, borderColor: string, textColor: string;
        if (hc) {
            const pal: any = this.host.colorPalette;
            const fg = pal.foreground?.value ?? "#FFFFFF";
            const bk = pal.background?.value ?? "#000000";
            const selc = pal.foregroundSelected?.value ?? fg;
            bg = isActive ? selc : bk;
            borderColor = isActive ? selc : fg;
            textColor = isActive ? bk : fg;
        } else {
            bg = isActive ? col.activeBg.value.value : col.defaultBg.value.value;
            borderColor = isActive ? col.activeBorder.value.value : col.defaultBorder.value.value;
            textColor = isActive ? col.activeText.value.value : col.defaultText.value.value;
        }

        if (isActive && !isAll && c.showCheck.value) {
            const NS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(NS, "svg");
            svg.setAttribute("viewBox", "0 0 16 16");
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("class", "chip-check");
            const p = document.createElementNS(NS, "path");
            p.setAttribute("d", "M3 8.5l3 3 7-7");
            p.setAttribute("fill", "none");
            p.setAttribute("stroke", "currentColor");
            p.setAttribute("stroke-width", "2");
            p.setAttribute("stroke-linecap", "round");
            p.setAttribute("stroke-linejoin", "round");
            svg.appendChild(p);
            el.appendChild(svg);
        }
        const tx = document.createElement("span");
        tx.className = "chip-label";
        tx.textContent = label;
        el.appendChild(tx);
        if (badge) {
            const b = document.createElement("span");
            b.className = "chip-badge";
            b.textContent = badge;
            b.setAttribute("data-o", "badge");
            const bc = s.badgeCard.color.value?.value;
            if (bc && !hc) { b.style.color = bc; b.style.opacity = "1"; }
            el.appendChild(b);
        }

        const fill = layout === "grid" || (layout === "vertical" && lay.chipFill.value) || (layout === "horizontal" && lay.chipFill.value);
        Object.assign(el.style, {
            height: `${c.chipHeight.value}px`,
            borderRadius: `${c.chipRadius.value}px`,
            padding: `0 ${c.chipPaddingH.value}px`,
            fontSize: `${c.fontSize.value}px`,
            fontFamily: c.fontFamily.value,
            fontWeight: isActive ? "600" : "400",
            border: `1.5px solid ${borderColor}`,
            backgroundColor: bg,
            color: textColor,
            boxShadow: isActive || !c.shadow.value || hc ? "none" : "0 1px 2px rgba(0,0,0,0.07)",
            flex: layout === "horizontal" && lay.chipFill.value ? "1 1 auto" : "0 0 auto",
            width: fill && layout !== "horizontal" ? "100%" : "",
            maxWidth: "100%"
        });

        el.onclick = (e: MouseEvent) => {
            if (this.formatMode) return;   // en modo formato el clic elige qué formatear, no filtra
            this.toggle(key, isAll, s.chipSettingsCard.selection.multiSelect.value || e.ctrlKey || e.metaKey);
        };
        el.oncontextmenu = (e: MouseEvent) => {
            if (this.formatMode) return;
            this.selectionManager.showContextMenu(selectionId ?? ({} as powerbi.visuals.ISelectionId), { x: e.clientX, y: e.clientY });
            e.preventDefault();
            e.stopPropagation();
        };
        return el;
    }

    /** Información sobre herramientas de Power BI: el valor y, si hay medida, su cifra con el formato del modelo. */
    private bindTooltip(el: HTMLElement, it: ChipItem): void {
        const svc = this.host.tooltipService;
        if (!svc?.enabled()) return;
        el.removeAttribute("title");
        const datos = (): powerbi.extensibility.VisualTooltipDataItem[] => {
            const d: powerbi.extensibility.VisualTooltipDataItem[] = [{ displayName: this.categoryName, value: it.label }];
            if (this.measureName && it.measureText) d.push({ displayName: this.measureName, value: it.measureText });
            return d;
        };
        const args = (e: MouseEvent) => ({ coordinates: [e.clientX, e.clientY], isTouchEvent: false, dataItems: datos(), identities: [it.selectionId] });
        el.addEventListener("mouseover", (e: MouseEvent) => { if (!this.formatMode) svc.show(args(e)); });
        el.addEventListener("mousemove", (e: MouseEvent) => { if (!this.formatMode) svc.move(args(e)); });
        el.addEventListener("mouseleave", () => svc.hide({ isTouchEvent: false, immediately: true }));
    }

    private clearButton(hc: boolean, fgHC: string): HTMLButtonElement {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip-clear";
        const label = this.t("UI_Clear", "Clear selection");
        b.title = label;
        b.setAttribute("aria-label", label);
        b.textContent = "✕";
        b.disabled = this.selectedValues.size === 0;
        if (hc) Object.assign(b.style, { color: fgHC, borderColor: fgHC });
        b.addEventListener("click", (e) => {
            e.stopPropagation();
            if (this.formatMode) return;
            this.toggle(Visual.ALL_KEY, true, false);
        });
        return b;
    }

    // ─── Guía (consejos de configuración, solo editando) ─────────────────────────

    /**
     * Barra de consejos abajo, solo editando, con datos y si cabe: plantillas en un clic y, sin medida, el pozo Value.
     * persistProperties solo desde un clic. ✕ la cierra (style.guide = false); se reabre en Formato → Plantilla.
     */
    private renderGuide(vp: powerbi.IViewport): void {
        const s = this.formattingSettings;
        if (!this.editing || this.formatMode || !s.styleCard.guide.value || !this.interactionsAllowed()) return;
        if (!vp || vp.width < 300 || vp.height < 150) return;
        const pal: any = this.host.colorPalette;
        const hc = !!pal?.isHighContrast;
        const azul = hc ? (pal.foregroundSelected?.value || "#FFFF00") : "#2B6CB0";
        const g = document.createElement("div");
        g.className = "chip-guide";
        g.setAttribute("role", "region");
        g.setAttribute("aria-label", this.t("Guide_Title", "Setup tips"));
        if (hc) Object.assign(g.style, { background: pal.background?.value || "#000", color: pal.foreground?.value || "#FFF", borderColor: azul });
        g.onclick = e => e.stopPropagation();
        g.onkeydown = e => e.stopPropagation();
        const lbl = document.createElement("span");
        lbl.className = "chip-g-lbl";
        lbl.textContent = this.t("Guide_TryStyle", "Try a style:");
        g.appendChild(lbl);
        const actual = String(s.styleCard.template.value?.value ?? "classic");
        ([["classic", "Classic"], ["outline", "Outline"], ["soft", "Soft"], ["square", "Square"], ["segmented", "Segmented"], ["dark", "Dark"]] as [string, string][])
            .forEach(([v, d]) => {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "chip-g-btn" + (v === actual ? " on" : "");
                b.textContent = this.t("Enum_" + v, d);
                b.setAttribute("aria-pressed", String(v === actual));
                b.style.borderColor = azul;
                if (v === actual) { b.style.background = azul; b.style.color = hc ? (pal.background?.value || "#000") : "#FFFFFF"; } else b.style.color = azul;
                b.addEventListener("click", () => this.persistir("style", { template: v }));
                g.appendChild(b);
            });
        const src: any = this.lastOptions?.dataViews?.[0]?.categorical?.categories?.[0]?.source;
        if (src?.expr?.level && src?.expr?.arg?.hierarchy) {
            // Una jerarquía en Category: aquí solo se usa un nivel. Los niveles son de Chip Slicer Hierarchy.
            const a = document.createElement("a");
            a.className = "chip-g-tip chip-g-link";
            a.href = URL_HIERARCHY;
            a.textContent = this.t("Guide_Hierarchy", "Need several levels (country → city)? Try Chip Slicer Hierarchy.");
            a.addEventListener("click", (e) => { e.preventDefault(); if (this.interactionsAllowed()) this.host.launchUrl(URL_HIERARCHY); });
            g.appendChild(a);
        } else if (!this.lastOptions?.dataViews?.[0]?.categorical?.values?.length && vp.width >= 520) {
            const tip = document.createElement("span");
            tip.className = "chip-g-tip";
            tip.textContent = this.t("Guide_ValueTip", "Tip: add a measure to Value to show counts on the chips.");
            g.appendChild(tip);
        }
        const x = document.createElement("button");
        x.type = "button";
        x.className = "chip-g-close";
        x.textContent = "✕";
        x.title = this.t("Guide_Close", "Hide tips (Format → Style template)");
        x.setAttribute("aria-label", x.title);
        x.addEventListener("click", () => this.persistir("style", { guide: false }));
        g.appendChild(x);
        this.container.querySelector(".chip-root")?.appendChild(g);
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

    /**
     * Selección por defecto: si el informe se abre sin filtro en este segmentador, se aplica una vez. Si luego el
     * usuario limpia, se queda limpio. Editando, cambiar el texto la aplica en el momento.
     */
    private applyDefaultSelection(options: VisualUpdateOptions): void {
        const sel = this.formattingSettings.chipSettingsCard.selection;
        const txt = String(sel.defaultSelection.value ?? "").trim();
        const hayFiltro = (options.jsonFilters ?? []).length > 0;
        const cambio = this.defaultSig !== null && this.defaultSig !== txt;
        if (this.defaultSig === txt) return;
        if (!txt) { this.defaultSig = txt; return; }
        if (hayFiltro && !(cambio && this.editing)) { this.defaultSig = txt; return; }
        if (!this.interactionsAllowed() || this.formatMode) return;
        const tokens = txt.split(/[,;|]/).map(t => Visual.norm(t.trim())).filter(t => t);
        const hits = this.items.filter(it => tokens.indexOf(Visual.norm(it.label)) >= 0 || tokens.indexOf(Visual.norm(String(it.value))) >= 0);
        if (!hits.length) return;   // sin coincidencias todavía (datos filtrados): se reintenta en la próxima actualización
        this.defaultSig = txt;
        this.selectedValues.clear();
        (sel.multiSelect.value ? hits : hits.slice(0, 1)).forEach(it => this.selectedValues.add(it.key));
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
                if (this.formatMode) return;
                const multi = this.formattingSettings?.chipSettingsCard.selection.multiSelect.value || e.ctrlKey || e.metaKey;
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
                const it = this.items.find(x => x.key === current.dataset.key);
                this.selectionManager.showContextMenu(it?.selectionId ?? ({} as powerbi.visuals.ISelectionId), { x: r.left, y: r.bottom });
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

    /** Para buscar y comparar sin mayúsculas ni acentos. */
    private static norm(s: string): string {
        return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
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

    // ─── On-object ───────────────────────────────────────────────────────────────

    /** Pieza → [tarjeta, clave del nombre, nombre en inglés]. */
    private static readonly SUB: Record<string, [string, string, string]> = {
        chips: ["chipSettings", "chipSettings", "Chip Style"],
        header: ["header", "header", "Header"],
        badge: ["badge", "badge", "Values"],
    };

    /** Marca lo que se puede elegir en modo formato. Fuera de él, no deja rastro. */
    private markSubSelectables(): void {
        this.container.querySelectorAll("[data-o]").forEach(el => {
            if (!this.formatMode) { el.classList.remove(HtmlSubSelectableClass); return; }
            const o = el.getAttribute("data-o");
            const info = Visual.SUB[o];
            if (!info) return;
            el.classList.add(HtmlSubSelectableClass);
            el.setAttribute(SubSelectableObjectNameAttribute, o);
            el.setAttribute(SubSelectableDisplayNameAttribute, this.t(info[1], info[2]));
            el.setAttribute(SubSelectableTypeAttribute, String(powerbi.visuals.SubSelectionStylesType.Text));
        });
    }

    private getSubSelectionStyles(subs: powerbi.visuals.CustomVisualSubSelection[]): powerbi.visuals.SubSelectionStyles | undefined {
        const o = subs[0]?.customVisualObjects[0]?.objectName;
        const ref = (obj: string, prop: string, key: string, def: string) => ({ reference: { objectName: obj, propertyName: prop }, label: this.t(key, def) });
        const Text = powerbi.visuals.SubSelectionStylesType.Text;
        switch (o) {
            case "chips": return { type: Text, fontSize: ref("chipSettings", "fontSize", "fontSize", "Font size"),
                fontFamily: ref("chipSettings", "fontFamily", "fontFamily", "Font"),
                fontColor: ref("chipSettings", "defaultText", "defaultText", "Inactive text"),
                background: ref("chipSettings", "defaultBg", "defaultBg", "Inactive background") } as any;
            case "header": return { type: Text, fontSize: ref("header", "fontSize", "header_fontSize", "Font size"),
                fontFamily: ref("header", "fontFamily", "header_fontFamily", "Font"),
                bold: ref("header", "bold", "header_bold", "Bold"),
                fontColor: ref("header", "color", "header_color", "Color") } as any;
            case "badge": return { type: Text, fontColor: ref("badge", "color", "badge_color", "Color") } as any;
        }
        return undefined;
    }

    private getSubSelectionShortcuts(subs: powerbi.visuals.CustomVisualSubSelection[]): powerbi.visuals.VisualSubSelectionShortcuts | undefined {
        const o = subs[0]?.customVisualObjects[0]?.objectName;
        const info = Visual.SUB[o];
        if (!info) return undefined;
        const id = (obj: string, prop: string) => ({ objectName: obj, propertyName: prop });
        const toggle = (obj: string, prop: string, key: string, def: string) => ({ type: powerbi.visuals.VisualShortcutType.Toggle, ...id(obj, prop),
            relatedToggledFormattingIds: [id(obj, prop)], disabledLabel: this.t(key, def), enabledLabel: this.t(key, def) });
        const reset = (obj: string, props: string[]) => ({ type: powerbi.visuals.VisualShortcutType.Reset, relatedResetFormattingIds: props.map(p => id(obj, p)) });
        // FormattingSettingsService forma el uid "<objeto>-card" y Power BI lo publica como "Visual-<objeto>-card"
        // (comprobado en KPI Card 2.2): el atajo tiene que usar el segundo.
        const nav = { type: powerbi.visuals.VisualShortcutType.Navigate, destinationInfo: { cardUid: "Visual-" + info[0] + "-card" }, label: this.t(info[1], info[2]) };
        const div = { type: powerbi.visuals.VisualShortcutType.Divider };
        switch (o) {
            case "chips":
                return [{ type: powerbi.visuals.VisualShortcutType.Picker, ...id("chipSettings", "layout"), label: this.t("layout", "Layout") },
                    toggle("chipSettings", "multiSelect", "multiSelect", "Multi-select"),
                    toggle("chipSettings", "showSelectAll", "showSelectAll", "Show 'All' button"),
                    toggle("chipSettings", "showCheck", "showCheck", "Check mark on selected"), div,
                    reset("chipSettings", ["defaultBg", "defaultBorder", "defaultText", "activeBg", "activeBorder", "activeText"]), nav] as any;
            case "header":
                return [toggle("header", "show", "header_show", "Show header"), div, reset("header", ["fontSize", "fontFamily", "bold", "color"]), nav] as any;
            case "badge":
                return [toggle("badge", "show", "badge_show", "Show value on chips"), div, reset("badge", ["color"]), nav] as any;
        }
        return undefined;
    }

    // ─── Formatting model ────────────────────────────────────────────────────────

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        const s = this.formattingSettings ?? new VisualSettingsModel();
        const hasMeasure = !!this.lastOptions?.dataViews?.[0]?.categorical?.values?.length;
        s.badgeCard.visible = hasMeasure;
        const lay = s.chipSettingsCard.layoutGrp;
        const layout = String(lay.layout.value?.value ?? "horizontal");
        lay.columns.visible = layout === "grid";
        lay.wrap.visible = layout === "horizontal";
        lay.chipFill.visible = layout !== "grid";
        s.chipSettingsCard.selection.selectAllLabel.visible = !!s.chipSettingsCard.selection.showSelectAll.value;
        return this.formattingSettingsService.buildFormattingModel(s);
    }
}
