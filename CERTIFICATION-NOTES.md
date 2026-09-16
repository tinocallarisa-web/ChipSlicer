# Chip Slicer — Certification Notes v1.4.1.0

> Reference copy. Paste `CERTIFICATION-NOTES-SHORT.txt` into the "Notes for certification"
> field in Partner Center: that field keeps only 2,500 characters and is cleared on every
> resubmission.

---

## Source code (certification branch)

https://github.com/tinocallarisa-web/ChipSlicer/tree/certification

The repository is **private**. Access has been granted to the following Microsoft reviewer accounts:
- https://github.com/OSDC1033
- https://github.com/pbicvsupport

## Video

https://www.youtube.com/watch?v=uArWJsB_n7w

## Legal URLs

- Privacy Policy: https://tinocallarisa-web.github.io/ChipSlicer/privacy.html
- Terms of Use:   https://tinocallarisa-web.github.io/ChipSlicer/terms.html
- Support:        https://tinocallarisa-web.github.io/ChipSlicer/support.html
- Changelog:      https://tinocallarisa-web.github.io/ChipSlicer/changelog.html

---

## Why this update (1.4.1.0)

- **Support URL.** The 1.4.0.0 package pointed `supportUrl` to `https://tcviz.com/support`,
  which returns 404, and had no privacy link. Both now point to the pages above.
- **Filter values keep their data type.** Values were converted to text and back to numbers,
  so a text code such as `08001` was filtered as `8001`, and dates and blanks did not filter.
- **Filter target** is read from the column expression instead of splitting `queryName` at
  the first dot, which failed for table names containing a dot and for hierarchy levels.
- **Keyboard and screen readers:** the slicer is a single Tab stop (roving tabindex) with
  arrow keys, Home/End, Enter/Space, Escape and Shift+F10; `role="listbox"` with
  `aria-multiselectable`.
- `allowInteractions` is respected; the format pane and the landing page are localized
  (en-US, es-ES); numeric settings have minimum and maximum values.

No licensing, no new privileges, no network access.

---

## License validation

This visual is **completely free** — it does not use IVisualLicenseManager or any external
license server. All features are available to every user without any license check.

---

## Features (all free, no restrictions)

- Chip/pill-style slicer for any categorical field (up to 1,000 values)
- Single-select and multi-select modes; Ctrl+click adds to the selection
- Horizontal and vertical layout
- Fully customizable chip colors (active and inactive states)
- Configurable chip size, border radius, gap, and padding
- Optional "All" button with customizable label
- Page-level filtering via Power BI BasicFilter API
- Slicer sync across report pages (`supportsSynchronizingFilterState`) and bookmarks
- High contrast mode support
- Keyboard navigation and screen reader support
- Landing page when no data field is assigned

---

## Testing instructions

1. Import `ChipSlicer_sample.pbix` from the submission package.
2. The report opens with a pre-configured Chip Slicer on the canvas.
3. Verify chips render for each category value in the data.
4. Click individual chips — the report visuals should filter accordingly.
5. Enable **Multi-select** in the Format Pane and verify multiple chips can be active.
6. Click "All" — all filters should clear and all data should be visible.
7. Switch report pages and return — verify the selected chips are preserved.
8. Open Format Pane → **Chip Style** and adjust colors, size, and layout. Verify changes apply live.
9. Keyboard: Tab into the slicer, move with the arrow keys, select with Enter or Space,
   clear with Escape. Tab leaves the slicer in one step.
10. Remove the field from the Category well — verify the landing page appears.
11. Test in **High Contrast** mode — verify chips remain readable.

---

## Technical notes

- API version: 5.10.0
- Filtering: `host.applyJsonFilter` with `powerbi-models.BasicFilter` (`FilterAction.remove` to clear)
- Filter target: from `category.source.expr` (column or hierarchy level), falling back to `queryName`
- Filter values: the original typed values from the data view; dates as ISO strings
- Filter sync: active filter values are re-read from `options.jsonFilters` on every `update()`
- Rendering events: `renderingStarted`, `renderingFinished`, `renderingFailed` on every path
- DOM updates: atomic swap (content built in memory before touching the DOM)
- No external dependencies, no network calls, no telemetry

---

## Capabilities summary

```json
{
  "supportsHighlight": true,
  "supportsSynchronizingFilterState": true,
  "supportsLandingPage": true,
  "supportsKeyboardFocus": true,
  "supportsMultiVisualSelection": true,
  "privileges": []
}
```
