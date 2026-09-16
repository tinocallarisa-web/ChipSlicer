import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class ChipSettingsCard extends FormattingSettingsCard {
    public multiSelect = new formattingSettings.ToggleSwitch({
        name: "multiSelect",
        displayNameKey: "multiSelect",
        displayName: "Multi-select",
        value: false
    });

    public layout = new formattingSettings.ItemDropdown({
        name: "layout",
        displayNameKey: "layout",
        displayName: "Layout",
        items: [
            { value: "horizontal", displayName: "Horizontal" },
            { value: "vertical", displayName: "Vertical" }
        ],
        value: { value: "horizontal", displayName: "Horizontal" }
    });

    public chipHeight = new formattingSettings.NumUpDown({
        name: "chipHeight",
        displayNameKey: "chipHeight",
        displayName: "Chip height (px)",
        value: 34,
        // ValidatorType es const enum: 0 = Min, 1 = Max
        options: { minValue: { type: 0, value: 16 }, maxValue: { type: 1, value: 120 } }
    });

    public chipRadius = new formattingSettings.NumUpDown({
        name: "chipRadius",
        displayNameKey: "chipRadius",
        displayName: "Border radius (px)",
        value: 17,
        // ValidatorType es const enum: 0 = Min, 1 = Max
        options: { minValue: { type: 0, value: 0 }, maxValue: { type: 1, value: 60 } }
    });

    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayNameKey: "fontSize",
        displayName: "Font size",
        value: 12,
        // ValidatorType es const enum: 0 = Min, 1 = Max
        options: { minValue: { type: 0, value: 8 }, maxValue: { type: 1, value: 40 } }
    });

    public chipGap = new formattingSettings.NumUpDown({
        name: "chipGap",
        displayNameKey: "chipGap",
        displayName: "Gap (px)",
        value: 8,
        // ValidatorType es const enum: 0 = Min, 1 = Max
        options: { minValue: { type: 0, value: 0 }, maxValue: { type: 1, value: 40 } }
    });

    public chipPaddingH = new formattingSettings.NumUpDown({
        name: "chipPaddingH",
        displayNameKey: "chipPaddingH",
        displayName: "Horizontal padding (px)",
        value: 16,
        // ValidatorType es const enum: 0 = Min, 1 = Max
        options: { minValue: { type: 0, value: 0 }, maxValue: { type: 1, value: 60 } }
    });

    public defaultBg = new formattingSettings.ColorPicker({
        name: "defaultBg",
        displayNameKey: "defaultBg",
        displayName: "Inactive background",
        value: { value: "#F3F4F6" }
    });

    public defaultBorder = new formattingSettings.ColorPicker({
        name: "defaultBorder",
        displayNameKey: "defaultBorder",
        displayName: "Inactive border",
        value: { value: "#E5E7EB" }
    });

    public defaultText = new formattingSettings.ColorPicker({
        name: "defaultText",
        displayNameKey: "defaultText",
        displayName: "Inactive text",
        value: { value: "#374151" }
    });

    public activeBg = new formattingSettings.ColorPicker({
        name: "activeBg",
        displayNameKey: "activeBg",
        displayName: "Active background",
        value: { value: "#378ADD" }
    });

    public activeBorder = new formattingSettings.ColorPicker({
        name: "activeBorder",
        displayNameKey: "activeBorder",
        displayName: "Active border",
        value: { value: "#378ADD" }
    });

    public activeText = new formattingSettings.ColorPicker({
        name: "activeText",
        displayNameKey: "activeText",
        displayName: "Active text",
        value: { value: "#FFFFFF" }
    });

    public showSelectAll = new formattingSettings.ToggleSwitch({
        name: "showSelectAll",
        displayNameKey: "showSelectAll",
        displayName: "Show 'All' button",
        value: true
    });

    public selectAllLabel = new formattingSettings.TextInput({
        name: "selectAllLabel",
        displayNameKey: "selectAllLabel",
        displayName: "'All' button text",
        placeholder: "All",
        value: "All"
    });

    name: string = "chipSettings";
    displayName: string = "Chip Style";
    displayNameKey: string = "chipSettings";
    slices: FormattingSettingsSlice[] = [
        this.multiSelect,
        this.layout,
        this.chipHeight,
        this.chipRadius,
        this.fontSize,
        this.chipGap,
        this.chipPaddingH,
        this.defaultBg,
        this.defaultBorder,
        this.defaultText,
        this.activeBg,
        this.activeBorder,
        this.activeText,
        this.showSelectAll,
        this.selectAllLabel
    ];
}

export class VisualSettingsModel extends FormattingSettingsModel {
    public chipSettingsCard = new ChipSettingsCard();
    cards: FormattingSettingsCard[] = [this.chipSettingsCard];
}
