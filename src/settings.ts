import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class ChipSettingsCard extends FormattingSettingsCard {
    public multiSelect = new formattingSettings.ToggleSwitch({
        name: "multiSelect",
        displayName: "Multi-select",
        value: false
    });

    public layout = new formattingSettings.ItemDropdown({
        name: "layout",
        displayName: "Layout",
        items: [
            { value: "horizontal", displayName: "Horizontal" },
            { value: "vertical", displayName: "Vertical" }
        ],
        value: { value: "horizontal", displayName: "Horizontal" }
    });

    public chipHeight = new formattingSettings.NumUpDown({
        name: "chipHeight",
        displayName: "Chip height (px)",
        value: 34
    });

    public chipRadius = new formattingSettings.NumUpDown({
        name: "chipRadius",
        displayName: "Border radius (px)",
        value: 17
    });

    public fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font size",
        value: 12
    });

    public chipGap = new formattingSettings.NumUpDown({
        name: "chipGap",
        displayName: "Gap (px)",
        value: 8
    });

    public chipPaddingH = new formattingSettings.NumUpDown({
        name: "chipPaddingH",
        displayName: "Horizontal padding (px)",
        value: 16
    });

    public defaultBg = new formattingSettings.ColorPicker({
        name: "defaultBg",
        displayName: "Inactive background",
        value: { value: "#F3F4F6" }
    });

    public defaultBorder = new formattingSettings.ColorPicker({
        name: "defaultBorder",
        displayName: "Inactive border",
        value: { value: "#E5E7EB" }
    });

    public defaultText = new formattingSettings.ColorPicker({
        name: "defaultText",
        displayName: "Inactive text",
        value: { value: "#374151" }
    });

    public activeBg = new formattingSettings.ColorPicker({
        name: "activeBg",
        displayName: "Active background",
        value: { value: "#378ADD" }
    });

    public activeBorder = new formattingSettings.ColorPicker({
        name: "activeBorder",
        displayName: "Active border",
        value: { value: "#378ADD" }
    });

    public activeText = new formattingSettings.ColorPicker({
        name: "activeText",
        displayName: "Active text",
        value: { value: "#FFFFFF" }
    });

    public showSelectAll = new formattingSettings.ToggleSwitch({
        name: "showSelectAll",
        displayName: "Show 'All' button",
        value: true
    });

    public selectAllLabel = new formattingSettings.TextInput({
        name: "selectAllLabel",
        displayName: "'All' button text",
        placeholder: "All",
        value: "All"
    });

    name: string = "chipSettings";
    displayName: string = "Chip Style";
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
