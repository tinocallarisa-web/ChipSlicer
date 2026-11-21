# Chip Slicer — Tips & Hints
**Version 1.7.0.0 · Free for everyone · tcviz.com**

---

## What's new in 1.7.0.0

- **Accessibility card** — High contrast (*Automatic* follows Windows; *On* draws the slicer black on white even without the Windows theme), Focus color and Focus width for the keyboard ring, and Minimum text size for the chips, header, values and clear button. If the text no longer fits, the chip grows taller; long labels end with "…".
- **Conditional formatting (fx)** on Inactive background, Inactive text, Active background and Active text: rules, gradient or field value, chip by chip. A rule wins over the fixed colour and over the template.
- **Tooltips well** — measures shown in the chip tooltip; report page tooltips receive the chip under the mouse.

**Updating from 1.6:** nothing changes until you use the new settings. Fixed colours are kept.

## What's new in 1.6.0.0

- **Report theme template, now the default** — the selected chip takes the report theme's first data colour, with black or white text, whichever reads better; inactive chips, header and clear button take the theme's page colours. Flat, no shadow. Works on light and dark themes.
- **"+N" for chips that do not fit** — Horizontal layout with wrapping: when the chips need more rows than the box has, the last ones are grouped into a "+N" chip. Click it to see them all; "Show less" or Escape closes. Selected chips are never hidden. On by default.
- **Force selection** — the slicer always keeps a value selected (the Default selection, or else the first value). The "All" chip and the clear button are hidden. Off by default.
- **Six collection styles** — Boardroom, Ledger, Editorial, Signal, Aurora and Terrace: the same looks as the other TCViz visuals (KPI Card, Histogram), free here, so a page that uses them looks consistent. Thirteen templates in all.
- The clear button ✕ takes the inactive chip's colours instead of fixed greys.
- "Show setup tips" is now called **Setup guide**; the tips bar offers Report theme, Classic and the six collection styles.

**Updating from 1.5 or earlier:** reports that never chose a template switch to Report theme after the update; choose **Classic** to keep the earlier look. Colours set by hand are kept, and no saved setting was renamed or moved. Slicers whose chips overflowed now show "+N" instead of a scroll bar.

---

## Getting Started

1. **Install** — Add Chip Slicer from AppSource (Visualizations pane → Get more visuals).
2. **Drop a field** — Drag a column into the **Category** field well. One chip per value.
3. **Optional: add a measure** — Drag a measure into **Value** to show a count or total on each chip.
4. **Filter** — Click a chip to filter the page. Click it again, the ✕ button or "All" to clear.
5. **Pick a look** — The chips follow the report theme by default. Format pane → **Style template** changes the whole look in one click.

While you edit, a tips bar at the bottom of the visual offers Report theme, Classic and the six collection styles. Hide it with ✕ (it comes back from Format → Style template → Setup guide). It never shows in reading view.

Overview video: https://www.youtube.com/watch?v=cbJ_VHPA5Sk

---

## Field Wells

| Well | Accepts | Limit |
|---|---|---|
| **Category** | 1 column (text, number, date, true/false) or a hierarchy level | Up to 1,000 values |
| **Value** (optional) | 1 measure | Shown on each chip with the model's format |
| **Tooltips** (optional) | Measures | Shown in the chip tooltip, not on the chip |

With a measure in Value (or Tooltips), items for which every measure is blank are not shown. Remove the field from Category to see the start screen.

---

## Format Pane

### Style template

| Setting | Default | What it does |
|---|---|---|
| Template | Report theme | Report theme, Classic, Boardroom, Ledger, Editorial, Signal, Aurora, Terrace, Outline, Soft, Square, Segmented or Dark |
| Setup guide | On | Tips bar while editing (never in reading view) |

| Template | Look |
|---|---|
| Report theme (default) | Selected chip in the theme's first data colour with black or white text; inactive chips, header and clear button in the theme's page colours. Flat, no shadow. Light and dark themes |
| Classic | Grey pills, blue when selected. The look of 1.4 and 1.5 (the default until 1.5) |
| Boardroom | Navy chips, gold when selected. Pills |
| Ledger | Cream chips, deep red when selected. Georgia serif, nearly square corners (3 px) |
| Editorial | White chips, black when selected. Georgia serif, square corners |
| Signal | White chips, green when selected. 6 px corners |
| Aurora | Deep blue chips, aqua when selected. Pills |
| Terrace | Warm cream chips, terracotta when selected. Pills |
| Outline | White pills with a blue outline and a check mark when selected |
| Soft | Pale blue pills, solid blue when selected |
| Square | Small corners, black when selected |
| Segmented | Joined square buttons, like a segmented control |
| Dark | For dark report backgrounds |

Thirteen templates. Boardroom to Terrace are the styles of the TCViz collection (as in KPI Card and Histogram), free here and flat like Report theme. A template fills in what you have not changed yourself. When you pick a template, the colours and shapes it defines replace yours; anything else you changed stays.

### Chip Style — Selection

| Setting | Default | What it does |
|---|---|---|
| Multi-select | Off | On = every click toggles a chip |
| Force selection | Off | Always keeps a value selected: the Default selection, or else the first non-blank value. Hides "All", its text and the clear button; clicking the selected chip or Escape does not clear; with Multi-select the last value cannot be removed |
| Show "All" button | On | Adds a chip that clears the filter |
| "All" button text | All | Custom label for that chip |
| Show clear button | On | ✕ that clears the selection; only shows when something is selected |
| Default selection | (empty) | Values separated by commas, selected when the report opens with nothing selected in this slicer |
| Sort | Data order | Data order, A to Z, Z to A, or Value, largest first |

### Chip Style — Layout

| Setting | Default | What it does |
|---|---|---|
| Layout | Horizontal | Horizontal, Vertical or Grid |
| Columns | 0 | Grid columns; 0 = automatic |
| Wrap to next line | On | Off = a single row with horizontal scrolling |
| Group chips that don't fit (+N) | On | Horizontal with wrap only: chips that need more rows than the box has go into a "+N" chip that shows them all; "Show less" closes |
| Stretch chips to fill | Off | Chips share the available width |
| Alignment | Left | Left, Center or Right |
| Gap (px) | 8 | Space between chips |

### Chip Style — Chips

| Setting | Default | What it does |
|---|---|---|
| Chip height (px) | 34 | Height of every chip |
| Border radius (px) | 17 | Corner rounding (= half height for a full pill) |
| Horizontal padding (px) | 16 | Left/right padding inside each chip |
| Font | Segoe UI | Chip label font |
| Font size | 12 | Label size |
| Check mark on selected | Off | ✓ on selected chips |
| Shadow | On in Classic; off in every other template | Soft shadow under the chips |

### Chip Style — Colors

With Report theme (the default) these colours come from the report theme; the values below are the Classic ones. A colour you set by hand always wins.

| Setting | Default (Classic) | State |
|---|---|---|
| Inactive background | #F3F4F6 | Unselected chip fill |
| Inactive border | #E5E7EB | Unselected chip border |
| Inactive text | #374151 | Unselected chip label |
| Active background | #378ADD | Selected chip fill |
| Active border | #378ADD | Selected chip border |
| Active text | #FFFFFF | Selected chip label |

**fx (conditional formatting)** — Inactive background, Inactive text, Active background and Active text have the fx button: rules, gradient or field value, worked out for each chip. A rule wins over the fixed colour and the template (changing the template keeps it). With a background rule and no text rule, the text turns black or white if yours could not be read; a border with the same colour as the background follows the rule. The "All" chip keeps the fixed colours. High contrast wins over rules.

### Header

| Setting | Default | What it does |
|---|---|---|
| Show header | Off | Title above the chips |
| Text | (field name) | Empty = the field name |
| Font · Font size · Bold · Color | Segoe UI Semibold · 12 · Off · #252423 in Classic; the theme's text colour in Report theme | Header text style |

### Values

| Setting | Default | What it does |
|---|---|---|
| Show value on chips | On | Shows the measure from the Value well (appears only when there is a measure) |
| Color | (automatic) | Color of the value |

### Accessibility

| Setting | Default | What it does |
|---|---|---|
| High contrast | Automatic (Windows setting) | Automatic: the Windows high-contrast colours when Windows is in high contrast. On: black on white always; the selected chip is black with white text |
| Focus color | #005A9E | Keyboard focus ring (in high contrast, the theme's colour) |
| Focus width | 2 px | 1 to 6 px |
| Minimum text size | 8 | 6 to 24. Chips, header, values and clear button never go below it; the chip grows taller if needed |

### On-object formatting

With Format on, click a chip, the header or a chip value to see its options next to it. In format mode a click chooses what to format and does not filter.

### Highlighting and context menu

When another visual on the page highlights part of the data, the chips without data in that highlight are dimmed. Right-click a chip (or Shift+F10) for the Power BI context menu.

---

## Tips & Best Practices

- **Start from a template** — Pick the closest template, then change only what you need. Use Reset to default on a colour to let the template decide it.
- **Always one period selected** — Turn on Force selection with Year or Month in Category: the page never shows all periods mixed. Set a Default selection for the one it should open on; otherwise the first value is used.
- **Many values in a narrow strip** — Horizontal layout with wrapping in a one- or two-row box: the chips that do not fit go into "+N" and the reader opens it when needed.
- **Match your other TCViz visuals** — Use the same collection style (Boardroom, Ledger, Editorial, Signal, Aurora or Terrace) as your KPI Cards or Histograms.
- **Match the report** — Keep the Report theme template: the chips change with the report theme, light or dark.
- **Open on the current period** — Put Year in Category and type it in Default selection; the ✕ goes back to all years.
- **Show sizes before clicking** — Put a count measure in Value and Sort by value.
- **Colour by performance** — fx on Inactive background with a rule on a margin or growth measure: the reader sees which chips are good or bad before clicking.
- **More detail on hover** — Put extra measures in Tooltips, or a report page tooltip, instead of crowding the chip.
- **Readable on a projector** — Accessibility → Minimum text size 12 or more; the chips grow so the text fits.
- **Accessibility review** — Accessibility → High contrast = On shows the slicer black on white without changing Windows.
- **Show items with no value** — Wrap the measure as `COALESCE([Measure], 0)` so blank items still appear.
- **Long lists in small tiles** — Grid with Columns = 0 and a smaller chip height.
- **Slicer in a thin strip** — Make the box as low as you like: below the height of the header plus one row, the text and chips shrink to fit (never below 8 px or your minimum text size).
- **One row with scrolling** — Horizontal layout with Wrap to next line off.
- **Status toggles** — Segmented template with Multi-select on reads like a switch.
- **Header slicers** — Horizontal layout in a report header gives a navigation-bar look.
- **Sidebar slicers** — Vertical layout in a narrow side panel.
- **Full pill look** — Border radius = half of Chip height (e.g. height 34 → radius 17).
- **Ctrl+click** — Adds chips to the selection even when Multi-select is off.
- **Slicer sync** — View → Sync slicers keeps the selection across report pages. Bookmarks save it too.
- **Several levels** — Chip Slicer uses one level. For country → city with expand and collapse, use Chip Slicer Hierarchy: https://tcviz.com/product/chip-slicer-hierarchy/

---

## Keyboard

One Tab stop for the whole slicer. Arrow keys, Home and End move between chips; Enter or Space select (Ctrl adds); Escape clears (unless Force selection is on; with "+N" open, Escape first closes it); Shift+F10 opens the context menu. On "+N", Enter or Space opens it and moves the focus to the first chip revealed; Escape closes it and returns the focus to "+N".

---

## Example Configurations

### Year buttons
- Category: Year · Layout: Horizontal · Default selection: 2026
- Template: Classic · Show clear button: On

### Always one month selected
- Category: Month · Force selection: On · Default selection: the month to open on
- Template: Report theme

### Region filter with counts
- Category: Region · Value: a distinct-count measure · Sort: Value, largest first
- Template: Soft

### Compact product grid
- Layout: Grid · Columns: 0 · Height: 28 · Font size: 11
- Multi-select: On · Template: Outline

### Status switch
- Template: Segmented · Multi-select: On · Show "All": Off

---

## Troubleshooting

| Symptom | Solution |
|---|---|
| Chips don't appear | Add a field to the Category well |
| Clicking a chip does not filter other visuals | Check Format → Edit interactions, and that the field is related to their tables in the model |
| Some values are missing | With a measure in Value or Tooltips, items blank in every measure are hidden; other page filters also reduce values; beyond 1,000 values the rest are not loaded |
| Default selection does not apply | It only applies when the report opens with nothing selected in this slicer (a bookmark or saved selection wins); the text must match the chip text; separate values with commas |
| A template did not change some colours | A template changes only what it defines; use Reset to default on a colour. An fx rule also wins over the template: remove it with the fx button |
| Chip colours ignore my fx rule | High contrast is on (Windows, or Format → Accessibility → High contrast = On) |
| Chips got taller | Accessibility → Minimum text size is larger than the chip font: the chip grows so the text fits |
| The tips bar covers the chips | It only shows while editing; close it with ✕ or turn off Setup guide |
| After updating, the slicer looks different | Since 1.6 the default template is Report theme; choose Classic to get the earlier look back. Colours set by hand are kept |
| A "+N" chip replaced the scroll bar | Since 1.6 chips that do not fit are grouped; turn off Group chips that don't fit (+N) to scroll as before |
| "All" and ✕ disappeared; the selection cannot be cleared | Force selection is on; turn it off to clear the slicer |
| Dates look different from my table | Chips use the column's format in the model (Column tools → Format) |
| A hierarchy filters only the first level | Expected: Chip Slicer is one level. Use Chip Slicer Hierarchy for several levels |

---

*Chip Slicer is free for everyone: every feature, no Pro tier, no licence. Limits are technical and the same for all: 1 field in Category, 1 measure in Value, measures in Tooltips, up to 1,000 values.*
*12 languages: English, Spanish, Portuguese (Brazil, Portugal), French, German, Italian, Dutch, Polish, Japanese, Chinese (Simplified), Korean.*
*Support: https://tinocallarisa-web.github.io/ChipSlicer/support.html · support@tcviz.com*
