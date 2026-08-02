# Chip Slicer — Certification Notes v1.4.0.0

> Copy this content into the "Notes for certification team" field in Partner Center before
> submitting. This field is cleared on every resubmission — always paste fresh from here.

---

## Source code (certification branch)

https://github.com/tinocallarisa-web/chip-slicer/tree/certification

## Legal URLs

- Privacy Policy: https://tinocallarisa-web.github.io/chip-slicer/privacy.html
- Terms of Use:   https://tinocallarisa-web.github.io/chip-slicer/terms.html
- Support:        https://tinocallarisa-web.github.io/chip-slicer/support.html

## Video

https://www.youtube.com/watch?v=uArWJsB_n7w

---

## License validation

This visual is **completely free** — it does not use IVisualLicenseManager or any external
license server. There is no Free vs Pro split. All features are available to every user
without any license check. The paid plan previously offered on AppSource has been removed;
no active subscribers existed at the time of removal.

---

## Features (all free, no restrictions)

- Chip/pill-style slicer for any categorical field
- Single-select and multi-select modes
- Horizontal and vertical layout
- Fully customizable chip colors (active and inactive states: background, border, text)
- Configurable chip height, border radius, font size, gap, and horizontal padding
- Optional "Select All" button with customizable label
- Page-level filtering via Power BI BasicFilter API
- Slicer sync across report pages (`supportsSynchronizingFilterState`)
- High contrast mode support
- Full keyboard navigation (Tab, Enter, Space)
- Landing page when no data field is assigned

---

## Privacy and network access

- No external network requests of any kind
- No telemetry, analytics, or data collection
- No cookies, localStorage, or persistent storage
- All data processing is local within the Power BI environment
- No data is written to or read from the `.pbix` file outside of standard Power BI filter state

---

## Capabilities summary

```json
{
  "supportsHighlight": true,
  "supportsSynchronizingFilterState": true,
  "supportsLandingPage": true,
  "supportsKeyboardFocus": true,
  "supportsMultiVisualSelection": true
}
```

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
9. Remove the field from the Category well — verify the landing page appears.
10. Test in **High Contrast** mode (Power BI View menu) — verify chips remain readable.

---

## Technical notes

- API version: 5.10.0
- Filtering: `host.applyJsonFilter` with `powerbi-models.BasicFilter`
- Filter target: extracted from `category.source.queryName` (table.column)
- Filter sync: active filter values are re-read from `options.jsonFilters` on every `update()`
- Rendering events: `renderingStarted`, `renderingFinished`, `renderingFailed` implemented on all code paths
- DOM updates: atomic swap (content built in memory before touching the DOM)
- No external dependencies, no network calls, no telemetry
- No IVisualLicenseManager — licensing was removed in v1.4.0.0
