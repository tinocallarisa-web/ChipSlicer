import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

// ValidatorType es const enum: 0 = Min, 1 = Max
const rango = (min: number, max: number) => ({ minValue: { type: 0, value: min }, maxValue: { type: 1, value: max } });

/**
 * Las propiedades publicadas en 1.3–1.4 viven todas en el objeto "chipSettings" (informes guardados): no se mueven.
 * La 1.5 las reparte en grupos de la misma tarjeta, que es solo presentación.
 */
class SelectionGroup extends formattingSettings.Group {
    public multiSelect = new formattingSettings.ToggleSwitch({
        name: "multiSelect", displayNameKey: "multiSelect", displayName: "Multi-select", value: false
    });
    public showSelectAll = new formattingSettings.ToggleSwitch({
        name: "showSelectAll", displayNameKey: "showSelectAll", displayName: "Show 'All' button", value: true
    });
    public selectAllLabel = new formattingSettings.TextInput({
        name: "selectAllLabel", displayNameKey: "selectAllLabel", displayName: "'All' button text", placeholder: "All", value: "All"
    });
    public showClear = new formattingSettings.ToggleSwitch({
        name: "showClear", displayNameKey: "showClear", displayName: "Show clear button", value: true
    });
    public defaultSelection = new formattingSettings.TextInput({
        name: "defaultSelection", displayNameKey: "defaultSelection", displayName: "Default selection",
        placeholder: "e.g. Spain, France", value: ""
    });
    public sort = new formattingSettings.ItemDropdown({
        name: "sort", displayNameKey: "sort", displayName: "Sort",
        items: [
            { value: "data", displayName: "Data order", displayNameKey: "Enum_data" } as any,
            { value: "asc", displayName: "A to Z", displayNameKey: "Enum_asc" } as any,
            { value: "desc", displayName: "Z to A", displayNameKey: "Enum_desc" } as any,
            { value: "valueDesc", displayName: "Value, largest first", displayNameKey: "Enum_valueDesc" } as any
        ],
        value: { value: "data", displayName: "Data order", displayNameKey: "Enum_data" } as any
    });
    name = "grpSelection";
    displayName = "Selection";
    displayNameKey = "grpSelection";
    slices: FormattingSettingsSlice[] = [this.multiSelect, this.showSelectAll, this.selectAllLabel, this.showClear, this.defaultSelection, this.sort];
}

class LayoutGroup extends formattingSettings.Group {
    public layout = new formattingSettings.ItemDropdown({
        name: "layout", displayNameKey: "layout", displayName: "Layout",
        items: [
            { value: "horizontal", displayName: "Horizontal", displayNameKey: "Enum_horizontal" } as any,
            { value: "vertical", displayName: "Vertical", displayNameKey: "Enum_vertical" } as any,
            { value: "grid", displayName: "Grid", displayNameKey: "Enum_grid" } as any
        ],
        value: { value: "horizontal", displayName: "Horizontal", displayNameKey: "Enum_horizontal" } as any
    });
    public columns = new formattingSettings.NumUpDown({
        name: "columns", displayNameKey: "columns", displayName: "Columns (0 = automatic)", value: 0, options: rango(0, 20)
    });
    public wrap = new formattingSettings.ToggleSwitch({
        name: "wrap", displayNameKey: "wrap", displayName: "Wrap to next line", value: true
    });
    public chipFill = new formattingSettings.ToggleSwitch({
        name: "chipFill", displayNameKey: "chipFill", displayName: "Stretch chips to fill", value: false
    });
    public align = new formattingSettings.ItemDropdown({
        name: "align", displayNameKey: "align", displayName: "Alignment",
        items: [
            { value: "left", displayName: "Left", displayNameKey: "Enum_left" } as any,
            { value: "center", displayName: "Center", displayNameKey: "Enum_center" } as any,
            { value: "right", displayName: "Right", displayNameKey: "Enum_right" } as any
        ],
        value: { value: "left", displayName: "Left", displayNameKey: "Enum_left" } as any
    });
    public chipGap = new formattingSettings.NumUpDown({
        name: "chipGap", displayNameKey: "chipGap", displayName: "Gap (px)", value: 8, options: rango(0, 40)
    });
    name = "grpLayout";
    displayName = "Layout";
    displayNameKey = "grpLayout";
    slices: FormattingSettingsSlice[] = [this.layout, this.columns, this.wrap, this.chipFill, this.align, this.chipGap];
}

class ChipGroup extends formattingSettings.Group {
    public chipHeight = new formattingSettings.NumUpDown({
        name: "chipHeight", displayNameKey: "chipHeight", displayName: "Chip height (px)", value: 34, options: rango(16, 120)
    });
    public chipRadius = new formattingSettings.NumUpDown({
        name: "chipRadius", displayNameKey: "chipRadius", displayName: "Border radius (px)", value: 17, options: rango(0, 60)
    });
    public chipPaddingH = new formattingSettings.NumUpDown({
        name: "chipPaddingH", displayNameKey: "chipPaddingH", displayName: "Horizontal padding (px)", value: 16, options: rango(0, 60)
    });
    public fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily", displayNameKey: "fontFamily", displayName: "Font", value: "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif"
    });
    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize", displayNameKey: "fontSize", displayName: "Font size", value: 12, options: rango(8, 40)
    });
    public showCheck = new formattingSettings.ToggleSwitch({
        name: "showCheck", displayNameKey: "showCheck", displayName: "Check mark on selected", value: false
    });
    public shadow = new formattingSettings.ToggleSwitch({
        name: "shadow", displayNameKey: "shadow", displayName: "Shadow", value: true
    });
    name = "grpChip";
    displayName = "Chips";
    displayNameKey = "grpChip";
    slices: FormattingSettingsSlice[] = [this.chipHeight, this.chipRadius, this.chipPaddingH, this.fontFamily, this.fontSize, this.showCheck, this.shadow];
}

class ColorsGroup extends formattingSettings.Group {
    public defaultBg = new formattingSettings.ColorPicker({ name: "defaultBg", displayNameKey: "defaultBg", displayName: "Inactive background", value: { value: "#F3F4F6" } });
    public defaultBorder = new formattingSettings.ColorPicker({ name: "defaultBorder", displayNameKey: "defaultBorder", displayName: "Inactive border", value: { value: "#E5E7EB" } });
    public defaultText = new formattingSettings.ColorPicker({ name: "defaultText", displayNameKey: "defaultText", displayName: "Inactive text", value: { value: "#374151" } });
    public activeBg = new formattingSettings.ColorPicker({ name: "activeBg", displayNameKey: "activeBg", displayName: "Active background", value: { value: "#378ADD" } });
    public activeBorder = new formattingSettings.ColorPicker({ name: "activeBorder", displayNameKey: "activeBorder", displayName: "Active border", value: { value: "#378ADD" } });
    public activeText = new formattingSettings.ColorPicker({ name: "activeText", displayNameKey: "activeText", displayName: "Active text", value: { value: "#FFFFFF" } });
    name = "grpColors";
    displayName = "Colors";
    displayNameKey = "grpColors";
    slices: FormattingSettingsSlice[] = [this.defaultBg, this.defaultBorder, this.defaultText, this.activeBg, this.activeBorder, this.activeText];
}

export class ChipSettingsCard extends formattingSettings.CompositeCard {
    public selection = new SelectionGroup();
    public layoutGrp = new LayoutGroup();
    public chip = new ChipGroup();
    public colors = new ColorsGroup();
    name = "chipSettings";
    displayName = "Chip Style";
    displayNameKey = "chipSettings";
    groups: formattingSettings.Group[] = [this.selection, this.layoutGrp, this.chip, this.colors];
}

export class HeaderCard extends FormattingSettingsCard {
    public show = new formattingSettings.ToggleSwitch({ name: "show", displayNameKey: "header_show", displayName: "Show header", value: false });
    public text = new formattingSettings.TextInput({ name: "text", displayNameKey: "header_text", displayName: "Text", placeholder: "Field name", value: "" });
    public fontFamily = new formattingSettings.FontPicker({ name: "fontFamily", displayNameKey: "header_fontFamily", displayName: "Font", value: "'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif" });
    public fontSize = new formattingSettings.NumUpDown({ name: "fontSize", displayNameKey: "header_fontSize", displayName: "Font size", value: 12, options: rango(8, 40) });
    public bold = new formattingSettings.ToggleSwitch({ name: "bold", displayNameKey: "header_bold", displayName: "Bold", value: false });
    public color = new formattingSettings.ColorPicker({ name: "color", displayNameKey: "header_color", displayName: "Color", value: { value: "#252423" } });
    topLevelSlice = this.show;
    name = "header";
    displayName = "Header";
    displayNameKey = "header";
    slices: FormattingSettingsSlice[] = [this.text, this.fontFamily, this.fontSize, this.bold, this.color];
}

export class BadgeCard extends FormattingSettingsCard {
    public show = new formattingSettings.ToggleSwitch({ name: "show", displayNameKey: "badge_show", displayName: "Show value on chips", value: true });
    public color = new formattingSettings.ColorPicker({ name: "color", displayNameKey: "badge_color", displayName: "Color", value: { value: "" } });
    topLevelSlice = this.show;
    name = "badge";
    displayName = "Values";
    displayNameKey = "badge";
    slices: FormattingSettingsSlice[] = [this.color];
}

export class StyleCard extends FormattingSettingsCard {
    public template = new formattingSettings.ItemDropdown({
        name: "template", displayNameKey: "style_template", displayName: "Template",
        items: [
            { value: "classic", displayName: "Classic", displayNameKey: "Enum_classic" } as any,
            { value: "outline", displayName: "Outline", displayNameKey: "Enum_outline" } as any,
            { value: "soft", displayName: "Soft", displayNameKey: "Enum_soft" } as any,
            { value: "square", displayName: "Square", displayNameKey: "Enum_square" } as any,
            { value: "segmented", displayName: "Segmented", displayNameKey: "Enum_segmented" } as any,
            { value: "dark", displayName: "Dark", displayNameKey: "Enum_dark" } as any
        ],
        value: { value: "classic", displayName: "Classic", displayNameKey: "Enum_classic" } as any
    });
    public guide = new formattingSettings.ToggleSwitch({ name: "guide", displayNameKey: "style_guide", displayName: "Show setup tips", value: true });
    name = "style";
    displayName = "Style template";
    displayNameKey = "style";
    slices: FormattingSettingsSlice[] = [this.template, this.guide];
}

export class VisualSettingsModel extends FormattingSettingsModel {
    public styleCard = new StyleCard();
    public chipSettingsCard = new ChipSettingsCard();
    public headerCard = new HeaderCard();
    public badgeCard = new BadgeCard();
    cards: Array<FormattingSettingsCard | formattingSettings.CompositeCard> = [this.styleCard, this.chipSettingsCard, this.headerCard, this.badgeCard];
}

/**
 * Plantillas: valores de chipSettings que la plantilla pone cuando el autor no los ha fijado. "classic" es el aspecto
 * de 1.4 (los informes guardados sin plantilla se ven igual). Al ELEGIR una, el visual borra esas propiedades
 * guardadas para que se vea (aplicarPlantilla).
 */
export const TEMPLATES: Record<string, Record<string, string | number | boolean>> = {
    classic: {},
    outline: { defaultBg: "#FFFFFF", defaultBorder: "#C8C6C4", defaultText: "#323130", activeBg: "#FFFFFF", activeBorder: "#2B6CB0", activeText: "#2B6CB0", shadow: false, showCheck: true },
    soft: { defaultBg: "#EEF3F9", defaultBorder: "#EEF3F9", defaultText: "#1F4E80", activeBg: "#2B6CB0", activeBorder: "#2B6CB0", activeText: "#FFFFFF", shadow: false },
    square: { chipRadius: 4, defaultBg: "#FFFFFF", defaultBorder: "#D2D0CE", defaultText: "#252423", activeBg: "#252423", activeBorder: "#252423", activeText: "#FFFFFF", shadow: false },
    segmented: { chipRadius: 0, chipGap: 0, defaultBg: "#FFFFFF", defaultBorder: "#C8C6C4", defaultText: "#323130", activeBg: "#2F7A47", activeBorder: "#2F7A47", activeText: "#FFFFFF", shadow: false },
    dark: { defaultBg: "#2B2B2B", defaultBorder: "#3B3A39", defaultText: "#E1DFDD", activeBg: "#9DC3E6", activeBorder: "#9DC3E6", activeText: "#10263F", shadow: false }
};
