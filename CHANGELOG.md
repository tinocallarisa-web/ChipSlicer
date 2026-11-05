# Changelog — Chip Slicer

All notable changes to this project will be documented in this file.

---

## [1.6.0.0] — unreleased

### Added
- **"+N" for chips that do not fit**: in a horizontal layout with wrapping, when the chips need more rows than the
  box has, the last ones are grouped into a "+N" chip. Clicking it (or Enter) shows them all, with "Show less" at
  the start to close; Escape closes too. Selected chips are never hidden. *On by default: slicers whose chips
  overflowed now show "+N" instead of a scroll bar.* Format → Chip Style → Layout → Group chips that don't fit.
- **Force selection**: the slicer always keeps a value selected. With nothing selected it selects the default
  selection, or else the first value; the "All" chip and the clear button are hidden, and the last selected value
  cannot be removed. Off by default.
- **Report theme** template: chips, header and clear button take the report theme's colours, as a native visual.

### Changed
- **The default template is now Report theme.** Reports that never chose a template change look after the update;
  choose Classic to keep the earlier look. Colours set by hand are kept.
- The clear button takes the inactive chip's colours instead of fixed greys, which could not be read on dark styles.
- "Show setup tips" is now called "Setup guide", as in the rest of the TCViz collection.

## [1.5.0.0] — 2026-10-22

### Added
- **Clear button** (✕): removes the selection in one click. In the header when it is shown, otherwise in the
  top-right corner, and only when something is selected.
- **Default selection**: type values separated by commas; the report opens with them selected when this slicer has
  no selection. If the user clears it, it stays clear until the page is opened again.
- **Value field** (optional): a measure shown on each chip with the model's format, dynamic format strings included.
  Items without a value are hidden.
- **Sort**: data order, A to Z, Z to A, or by value.
- **Header** with its own text, font, size, bold and color.
- **Grid layout** with fixed or automatic columns; a single row with horizontal scrolling; stretch chips to fill;
  alignment. Long labels end with "…".
- **Style templates**: Classic (the look of earlier versions, and the default), Outline, Soft, Square, Segmented, Dark.
  Check mark on selected chips, shadow and font.
- **On-object formatting**: chips, header and chip values can be selected and formatted on the canvas.
- Power BI **tooltips** on each chip (value and measure).
- **Start screen** with the steps and links, and **setup tips** while editing (templates in one click). When a
  hierarchy is dropped into Category, the tips point to Chip Slicer Hierarchy for several levels.
- **12 languages**: English, Spanish, Portuguese (Brazil, Portugal), French, German, Italian, Dutch, Polish, Japanese,
  Chinese (Simplified), Korean.
- Chip labels use the column's format and the report locale for dates and numbers.

### Changed
- New icon.
- Format pane reorganised in groups (Selection, Layout, Chips, Colors). No saved setting moved: reports made with
  earlier versions look and behave the same.
- Tool chain updated (Power BI visuals API 5.11.1, pbiviz 7.2.1).

---

## [1.4.1.0] — 2026-09-16

### Fixed
- **Support link.** The support URL in the visual's information pane pointed to a page that
  does not exist (tcviz.com/support). It now opens the support page, and the privacy policy
  link is included.
- **Filtering by text codes, dates and blanks.** Values were converted to text and back to
  numbers, so a code such as `08001` was filtered as `8001` and matched nothing; dates and
  blank values did not filter either. Filters now use the original value.
- **Tables with a dot in their name and date hierarchy levels** could not be filtered.

### Changed
- **Keyboard:** the slicer is a single Tab stop. Move with the arrow keys, Home and End;
  select with Enter or Space (Ctrl adds to the selection); Escape clears; Shift+F10 opens the
  context menu. Screen readers announce it as a list with its selected items.
- Ctrl+click adds a chip to the selection even when Multi-select is off.
- Blank values are shown as "(Blank)".
- Format pane and landing page translated (English, Spanish). Numeric settings have sensible
  minimum and maximum values.
- The slicer does not change the filter where Power BI disallows interactions.

---

## [1.4.0.0] — 2026-08-02

### Changed
- Removed paid licensing model. All features are now completely free for every user.
- Removed IVisualLicenseManager integration and all Free/Pro tier gating.
- Updated Terms of Use and Privacy Policy to remove licensing references.

---

## [1.3.0.0] — 2026-04-22

### Added
- Initial public release on Microsoft AppSource.
- Chip/pill-style slicer with single-select and multi-select modes.
- Horizontal and vertical layout options.
- Full color customization for active and inactive chip states.
- Configurable chip height, border radius, gap, and horizontal padding.
- Optional "Select All" button with customizable label.
- Page-level filtering via Power BI BasicFilter API.
- Slicer sync across report pages.
- High contrast mode support.
- Full keyboard navigation (Tab, Enter, Space).
- Landing page when no data field is assigned.
