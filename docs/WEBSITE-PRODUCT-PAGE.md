# Chip Slicer — Website Product Page Content
**Version 1.6.0.0**

---

## TAB 1: Overview

### Headline
**Chip Slicer — One-click chip filters for Power BI**

### Subheadline
Turn a field into a row of buttons that filter the page with one click. Free for everyone: no Pro tier, no licence, no watermark.

### The Problem
The default Power BI list slicer takes up space and looks out of place in polished dashboards, and a dropdown hides the values until it is opened. Neither opens the report on a chosen value, keeps one value always selected, shows a count next to each item, or clears the selection with one button.

### How It Works
Chip Slicer renders each value of a field as a clickable chip. Selected chips are visible at a glance. Click to select, click again (or ✕, or All) to clear. The selection is a standard Power BI filter: it follows sync slicers, is saved in bookmarks, respects edit interactions and appears in the filter pane.

### Who It's For
- Power BI report developers who want a cleaner, button-style filter
- Dashboard designers building client-facing reports
- Analysts who need a compact filter that doesn't dominate the layout

### What Makes It Different
- **Default selection** — the report opens with the values you choose already selected
- **Clear button (✕)** — removes the selection in one click
- **Value on each chip** — put a measure in Value and each chip shows its count or total, with the model's format
- **Force selection** — the slicer always keeps a value selected: your default selection, or else the first value
- **"+N" for chips that do not fit** — a narrow strip groups the extra chips into "+N"; one click shows them all
- **Seven style templates, following your report theme by default** — Report theme, Classic, Outline, Soft, Square, Segmented, Dark
- **Grid layout** — fixed or automatic columns
- **Free for everyone** — every feature included, no Pro tier, no licence

### At a Glance
- ✅ Single-select and multi-select (Ctrl+click adds)
- ✅ Default selection
- ✅ Force selection (always one value selected)
- ✅ Clear button (✕) and optional "All" chip
- ✅ Optional measure on each chip, with sort by value
- ✅ Sort: data order, A to Z, Z to A, by value
- ✅ Horizontal, vertical and grid layout
- ✅ "+N" chip for the chips that do not fit
- ✅ Seven style templates; Report theme (the default) follows light and dark report themes
- ✅ Optional header
- ✅ On-object formatting
- ✅ Power BI tooltips on each chip
- ✅ Sync slicers and bookmarks
- ✅ Keyboard, screen reader and high contrast support
- ✅ 12 languages
- ✅ Up to 1,000 values
- ✅ Free for everyone

### Video
Overview: https://www.youtube.com/watch?v=cbJ_VHPA5Sk

---

## TAB 2: Features

### Selection
**Single & Multi-select** — In single select, a click selects one chip and clicking it again clears it; Ctrl+click adds chips even in this mode. With Multi-select on, every click toggles a chip.

**"All" chip** — An optional chip that clears the filter. Its text can be changed.

**Clear button (✕)** — Removes the selection in one click. It sits in the header when the header is shown, otherwise in the top-right corner, and only appears when something is selected.

**Force selection** — The slicer always keeps a value selected. When nothing valid is selected it applies the Default selection if you set one, otherwise the first non-blank value in the order shown. This also happens when a bookmark without a filter is applied, or when the selected value disappears because another slicer filtered this one. The "All" chip, its text setting and the clear button are hidden; clicking the selected chip or Escape does not clear it; with Multi-select the last selected value cannot be removed. It does not act in format mode or where Power BI disallows interactions. Off by default.

**Default selection** — Type values separated by commas, e.g. `Spain, France`. When the report opens with nothing selected in this slicer, those values are selected. If the user clears them, the slicer stays clear until the page is opened again. Values match the chip text, without case or accents. In single-select mode the first match is used.

**Sort** — Data order (the model's sort, including Sort by column), A to Z, Z to A, or by value when there is a measure.

**Works like a native slicer** — The selection is a standard Power BI filter: sync slicers, bookmarks, edit interactions and cross-page filters.

### Values
**Value field (optional)** — Put a measure in Value and each chip shows it (a count, a total, a percentage), with the model's format, dynamic format strings included. As in any Power BI visual with a measure, items for which the measure is blank are not shown.

**Tooltips** — Power BI tooltips on each chip with the value and the measure.

### Appearance
**Style templates** — Seven: Report theme (the default), Classic (the look of 1.4 and 1.5), Outline, Soft, Square, Segmented and Dark. With Report theme the selected chip takes the report theme's first data colour, with black or white text, whichever reads better; inactive chips, the header and the clear button take the theme's page colours; flat, no shadow. It works on light and dark themes. A template fills in what you have not changed yourself.

**Layout** — Horizontal (wrapping or a single row with horizontal scrolling), Vertical, or Grid with fixed or automatic columns. Stretch chips to fill and alignment. Long labels end with "…".

**"+N" for chips that do not fit** — In a horizontal layout with wrapping, when the chips need more rows than the box has, the last ones are grouped into a "+N" chip with a dashed border. Click it (or Enter or Space): all the chips are shown with a vertical scroll and a "Show less" chip at the start; "Show less" or Escape closes. Selected chips are never hidden; if even they do not fit, the slicer scrolls as before. Nothing is saved: it is only the reader's view. Vertical, Grid or no wrapping scroll as before. On by default (Group chips that don't fit).

**Chips** — Height, border radius, horizontal padding, font, font size, check mark on selected chips and shadow.

**Colors** — Background, border and text for selected and unselected chips.

**Header** — Optional title with its own text, font, size, bold and color.

**On-object formatting** — With Format on, click a chip, the header or a chip value to format it on the canvas.

**Start screen and setup guide** — A start screen with the steps when no field is assigned, and a tips bar while editing that offers the templates in one click, Report theme included (Format → Style template → Setup guide). It never shows in reading view.

### Accessibility and languages
**Keyboard** — One Tab stop for the whole slicer; arrow keys, Home and End move between chips; Enter or Space select (Ctrl adds); Escape clears; Shift+F10 opens the context menu. On "+N", Enter or Space opens it and moves the focus to the first chip revealed; Escape closes it and returns the focus to "+N".

**Screen readers** — Announced as a list, with each chip's state and its value.

**High contrast** — The chips take the colours of the Windows high-contrast theme.

**12 languages** — English, Spanish, Portuguese (Brazil and Portugal), French, German, Italian, Dutch, Polish, Japanese, Chinese (Simplified) and Korean, following the language of Power BI.

**Formats** — Chip labels use the column's format and the report locale for dates and numbers.

### Need several levels?
Chip Slicer uses one level: if you drop a hierarchy into Category it filters by its first level. For several levels with expand and collapse, use **Chip Slicer Hierarchy**: https://tcviz.com/product/chip-slicer-hierarchy/

---

## TAB 3: Technical

### Specifications
- Version: 1.6.0.0
- Power BI visuals API: 5.11.1
- Package: Microsoft AppSource
- Price: free for everyone, no Pro tier, no licence

### Field Wells
| Field well | Accepts | Limit |
|---|---|---|
| Category | 1 column (text, number, date, true/false) or a hierarchy level | Up to 1,000 values |
| Value (optional) | 1 measure | Shown on each chip with the model's format |

### Format Pane
| Card / group | Settings |
|---|---|
| Style template | Template (Report theme — default, Classic, Outline, Soft, Square, Segmented, Dark) · Setup guide |
| Chip Style → Selection | Multi-select · Force selection (off) · Show 'All' button · 'All' button text · Show clear button · Default selection · Sort |
| Chip Style → Layout | Layout (Horizontal, Vertical, Grid) · Columns (0 = automatic) · Wrap to next line · Group chips that don't fit (+N) (horizontal with wrap, on) · Stretch chips to fill · Alignment · Gap |
| Chip Style → Chips | Chip height · Border radius · Horizontal padding · Font · Font size · Check mark on selected · Shadow |
| Chip Style → Colors | Inactive background, border, text · Active background, border, text |
| Header | Show header · Text (empty = field name) · Font · Font size · Bold · Color |
| Values | Show value on chips · Color (appears when a measure is in Value) |

Updating from 1.5 or earlier: reports that never chose a template switch to Report theme after the update; choose Classic to keep the earlier look. Colours set by hand are kept, and no saved setting was renamed or moved. Slicers whose chips overflowed now show "+N" instead of a scroll bar.

### Capabilities
- `supportsHighlight: true`
- `supportsSynchronizingFilterState: true`
- `supportsLandingPage: true`
- `supportsKeyboardFocus: true`
- `supportsMultiVisualSelection: true`
- `supportsOnObjectFormatting: true`
- Tooltips (default and canvas)

### Privacy & Network
- No network calls
- No telemetry, no cookies
- Stores nothing outside the report
- Links on the start screen open only when you click them, through Power BI

### Compatibility
- Works wherever custom visuals from AppSource work.
- Where Power BI disallows interactions (some exports and embedded views), the chips are shown but do not change the filter.

### Support
- Documentation: https://tinocallarisa-web.github.io/ChipSlicer/support.html
- Bug reports: https://github.com/tinocallarisa-web/ChipSlicer/issues
- Email: support@tcviz.com

---

## TAB 4: Changelog

### [1.6.0.0] — unreleased
**Added**
- "+N" for chips that do not fit: in a horizontal layout with wrapping, when the chips need more rows than the box has, the last ones are grouped into a "+N" chip. Clicking it (or Enter) shows them all, with "Show less" at the start to close; Escape closes too. Selected chips are never hidden. On by default: slicers whose chips overflowed now show "+N" instead of a scroll bar. Format → Chip Style → Layout → Group chips that don't fit.
- Force selection: the slicer always keeps a value selected. With nothing selected it selects the default selection, or else the first value; the "All" chip and the clear button are hidden, and the last selected value cannot be removed. Off by default.
- Report theme template: chips, header and clear button take the report theme's colours, as a native visual.

**Changed**
- The default template is now Report theme. Reports that never chose a template change look after the update; choose Classic to keep the earlier look. Colours set by hand are kept.
- The clear button takes the inactive chip's colours instead of fixed greys, which could not be read on dark styles.
- "Show setup tips" is now called "Setup guide", as in the rest of the TCViz collection.

### [1.5.0.0] — 2026-10-22
**Added**
- Clear button (✕): removes the selection in one click; in the header when it is shown, otherwise in the top-right corner, and only when something is selected.
- Default selection: values separated by commas; the report opens with them selected when this slicer has no selection. If the user clears it, it stays clear until the page is opened again.
- Value field (optional): a measure shown on each chip with the model's format, dynamic format strings included. Items without a value are hidden.
- Sort: data order, A to Z, Z to A, or by value.
- Header with its own text, font, size, bold and color.
- Grid layout with fixed or automatic columns; a single row with horizontal scrolling; stretch chips to fill; alignment. Long labels end with "…".
- Style templates: Classic (the look of earlier versions, and the default), Outline, Soft, Square, Segmented, Dark. Check mark on selected chips, shadow and font.
- On-object formatting: chips, header and chip values can be selected and formatted on the canvas.
- Power BI tooltips on each chip (value and measure).
- Start screen with the steps and links, and setup tips while editing (templates in one click). When a hierarchy is dropped into Category, the tips point to Chip Slicer Hierarchy for several levels.
- 12 languages: English, Spanish, Portuguese (Brazil, Portugal), French, German, Italian, Dutch, Polish, Japanese, Chinese (Simplified), Korean.
- Chip labels use the column's format and the report locale for dates and numbers.

**Changed**
- New icon.
- Format pane reorganised in groups (Selection, Layout, Chips, Colors). No saved setting moved: reports made with earlier versions look and behave the same.
- Tool chain updated (Power BI visuals API 5.11.1, pbiviz 7.2.1).

### [1.4.1.0] — 2026-09-16
**Fixed**
- Support link in the visual's information pane now opens the support page; privacy policy link included.
- Filtering by text codes (e.g. `08001`), dates and blanks now uses the original value.
- Tables with a dot in their name and date hierarchy levels can be filtered.

**Changed**
- Keyboard: a single Tab stop; arrow keys, Home and End; Enter or Space (Ctrl adds); Escape clears; Shift+F10 opens the context menu. Announced to screen readers as a list.
- Ctrl+click adds a chip even when Multi-select is off.
- Blank values are shown as "(Blank)".
- The slicer does not change the filter where Power BI disallows interactions.

### [1.4.0.0] — 2026-08-02
**Changed**
- Removed the paid licensing model. All features are free for every user.

### [1.3.0.0] — 2026-04-22
**Added**
- Initial public release on Microsoft AppSource.
