# Chip Slicer — Tips & Hints
**Version 1.4.0.0 · 100% Free · tcviz.com**

---

## Getting Started

1. **Install** — Import Chip Slicer from AppSource or via `.pbiviz` file (Visualizations panel → ⋯ → Import a visual from a file).
2. **Add to canvas** — Click the Chip Slicer icon in the Visualizations panel.
3. **Drop a field** — Drag any categorical column into the **Category** field well. Chips appear immediately.
4. **Filter** — Click any chip to filter all visuals on the page. Click again (or click "All") to clear.

---

## Field Wells

| Well | Accepts | Limit |
|---|---|---|
| **Category** | Any categorical column (text, number, date, boolean) | 1,000 values |

One field at a time. Remove the field to show the landing page placeholder.

---

## Format Pane — Chip Style

### Behaviour

| Setting | Default | What it does |
|---|---|---|
| Multi-select | Off | On = multiple chips can be active at once |
| Show "All" button | On | Adds a chip that clears all selections instantly |
| "All" button text | All | Custom label for the clear-all chip |
| Layout | Horizontal | Horizontal wraps chips; Vertical stacks them |

### Dimensions

| Setting | Default | What it does |
|---|---|---|
| Chip height (px) | 34 | Height of every chip |
| Border radius (px) | 17 | Corner rounding (= half height for full pill) |
| Font size | 12 | Label size in points |
| Gap (px) | 8 | Space between chips |
| Horizontal padding (px) | 16 | Left/right padding inside each chip |

### Colors

| Setting | Default | State |
|---|---|---|
| Inactive background | #F3F4F6 | Unselected chip fill |
| Inactive border | #E5E7EB | Unselected chip border |
| Inactive text | #374151 | Unselected chip label |
| Active background | #378ADD | Selected chip fill |
| Active border | #378ADD | Selected chip border |
| Active text | #FFFFFF | Selected chip label |

---

## Tips & Best Practices

- **Header slicers** — Use Horizontal layout in report headers for a navigation-bar look.
- **Sidebar slicers** — Use Vertical layout in a narrow side panel; chips stack cleanly.
- **Short labels** — Chip width adapts to label length; keep values concise.
- **Brand colors** — Set Active background to your report's accent color for consistency.
- **Full pill look** — Set Border radius to half of Chip height (e.g., height 34 → radius 17).
- **Guided analysis** — Keep Multi-select off to force single-value selection.
- **Exploratory dashboards** — Turn Multi-select on to let users combine values freely.
- **Slicer sync** — Use View → Sync Slicers to share state across all report pages.
- **Custom "All" label** — Change "All" to "Show all", "Reset", or your language equivalent.
- **Match theme** — Override Active colors to match Power BI theme accent colors.

---

## Example Configurations

### Classic pill slicer (single-select)
- Layout: Horizontal · Height: 34 · Radius: 17 · Gap: 8 · H-Padding: 16
- Multi-select: Off · Show "All": On

### Compact tag filter (multi-select)
- Layout: Horizontal · Height: 28 · Radius: 6 · Gap: 6 · H-Padding: 12 · Font: 11
- Multi-select: On · Active bg: your report accent color

### Sidebar navigation
- Layout: Vertical · Height: 40 · Radius: 8 · Gap: 4 · H-Padding: 20 · Font: 13
- Multi-select: Off · Show "All": On

### Minimal / borderless look
- Inactive border = same as Inactive background · Active border = same as Active background

---

## Troubleshooting

| Symptom | Solution |
|---|---|
| Chips don't appear | Add a field to the Category well |
| Filter doesn't affect other visuals | Check the filter interaction settings (Format → Edit interactions) |
| "All" chip is missing | Enable Show "All" button in Format Pane → Chip Style |
| Can only select one chip | Enable Multi-select in Format Pane → Chip Style |
| Colors look wrong in high contrast | Expected — Chip Slicer auto-adapts to the OS/Power BI high contrast theme |
| Chips still filtered after switching pages | Use Sync Slicers to share state, or clear the filter before navigating |
| Visual appears blank after import | Remove it from the canvas and re-add it; reload Power BI Desktop if needed |

---

*Chip Slicer is 100% free — all features are available to every user with no license required.*
*Support: https://tinocallarisa-web.github.io/chip-slicer/support.html*
