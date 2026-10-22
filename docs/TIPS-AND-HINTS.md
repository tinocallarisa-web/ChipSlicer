# Chip Slicer — Tips & Hints
**Version 1.5.0.0 · Free for everyone · tcviz.com**

---

## Getting Started

1. **Install** — Add Chip Slicer from AppSource (Visualizations pane → Get more visuals).
2. **Drop a field** — Drag a column into the **Category** field well. One chip per value.
3. **Optional: add a measure** — Drag a measure into **Value** to show a count or total on each chip.
4. **Filter** — Click a chip to filter the page. Click it again, the ✕ button or "All" to clear.
5. **Pick a look** — Format pane → **Style template** changes the whole look in one click.

While you edit, a tips bar at the bottom of the visual offers the templates. Hide it with ✕ (it comes back from Format → Style template → Show setup tips). It never shows in reading view.

Overview video: https://www.youtube.com/watch?v=uArWJsB_n7w

---

## Field Wells

| Well | Accepts | Limit |
|---|---|---|
| **Category** | 1 column (text, number, date, true/false) or a hierarchy level | Up to 1,000 values |
| **Value** (optional) | 1 measure | Shown on each chip with the model's format |

With a measure in Value, items for which the measure is blank are not shown. Remove the field from Category to see the start screen.

---

## Format Pane

### Style template

| Setting | Default | What it does |
|---|---|---|
| Template | Classic | Classic, Outline, Soft, Square, Segmented or Dark |
| Show setup tips | On | Tips bar while editing (never in reading view) |

| Template | Look |
|---|---|
| Classic | Grey pills, blue when selected. The look of earlier versions |
| Outline | White pills with a blue outline and a check mark when selected |
| Soft | Pale blue pills, solid blue when selected |
| Square | Small corners, black when selected |
| Segmented | Joined square buttons, like a segmented control |
| Dark | For dark report backgrounds |

A template fills in what you have not changed yourself. When you pick a template, the colours and shapes it defines replace yours; anything else you changed stays.

### Chip Style — Selection

| Setting | Default | What it does |
|---|---|---|
| Multi-select | Off | On = every click toggles a chip |
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
| Shadow | On | Soft shadow under the chips |

### Chip Style — Colors

| Setting | Default (Classic) | State |
|---|---|---|
| Inactive background | #F3F4F6 | Unselected chip fill |
| Inactive border | #E5E7EB | Unselected chip border |
| Inactive text | #374151 | Unselected chip label |
| Active background | #378ADD | Selected chip fill |
| Active border | #378ADD | Selected chip border |
| Active text | #FFFFFF | Selected chip label |

### Header

| Setting | Default | What it does |
|---|---|---|
| Show header | Off | Title above the chips |
| Text | (field name) | Empty = the field name |
| Font · Font size · Bold · Color | Segoe UI Semibold · 12 · Off · #252423 | Header text style |

### Values

| Setting | Default | What it does |
|---|---|---|
| Show value on chips | On | Shows the measure from the Value well (appears only when there is a measure) |
| Color | (automatic) | Color of the value |

### On-object formatting

With Format on, click a chip, the header or a chip value to see its options next to it. In format mode a click chooses what to format and does not filter.

---

## Tips & Best Practices

- **Start from a template** — Pick the closest template, then change only what you need. Use Reset to default on a colour to let the template decide it.
- **Open on the current period** — Put Year in Category and type it in Default selection; the ✕ goes back to all years.
- **Show sizes before clicking** — Put a count measure in Value and Sort by value.
- **Show items with no value** — Wrap the measure as `COALESCE([Measure], 0)` so blank items still appear.
- **Long lists in small tiles** — Grid with Columns = 0 and a smaller chip height.
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

One Tab stop for the whole slicer. Arrow keys, Home and End move between chips; Enter or Space select (Ctrl adds); Escape clears; Shift+F10 opens the context menu.

---

## Example Configurations

### Year buttons
- Category: Year · Layout: Horizontal · Default selection: 2026
- Template: Classic · Show clear button: On

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
| Some values are missing | With a measure in Value, blank items are hidden; other page filters also reduce values; beyond 1,000 values the rest are not loaded |
| Default selection does not apply | It only applies when the report opens with nothing selected in this slicer (a bookmark or saved selection wins); the text must match the chip text; separate values with commas |
| A template did not change some colours | A template changes only what it defines; use Reset to default on a colour |
| The tips bar covers the chips | It only shows while editing; close it with ✕ or turn off Show setup tips |
| Dates look different from my table | Chips use the column's format in the model (Column tools → Format) |
| A hierarchy filters only the first level | Expected: Chip Slicer is one level. Use Chip Slicer Hierarchy for several levels |

---

*Chip Slicer is free for everyone: every feature, no Pro tier, no licence. Limits are technical and the same for all: 1 field in Category, 1 measure in Value, up to 1,000 values.*
*12 languages: English, Spanish, Portuguese (Brazil, Portugal), French, German, Italian, Dutch, Polish, Japanese, Chinese (Simplified), Korean.*
*Support: https://tinocallarisa-web.github.io/ChipSlicer/support.html · support@tcviz.com*
