# Chip Slicer — Website Product Page Content
**Version 1.4.0.0**

---

## TAB 1: Overview

### Headline
**Chip Slicer — The modern way to filter in Power BI**

### Subheadline
Replace cluttered dropdown slicers with compact, beautiful chip/pill filters. 100% free, no license required.

### The Problem
The default Power BI list slicer takes up too much space, shows too little context, and looks out of place in polished dashboards. Dropdown slicers are hidden until clicked. Neither option gives your users an at-a-glance view of what's filtered and what isn't.

### How It Works
Chip Slicer renders each category value as a compact, clickable chip. Active filters are instantly visible by color. Users click to select, click again to deselect. No dropdowns, no scrolling, no confusion.

### Who It's For
- Power BI report developers who want a cleaner, more modern filtering UX
- Dashboard designers building client-facing reports
- Analysts who need a compact filter that doesn't dominate the layout

### What Makes It Different
- Chips show every available value at a glance — no hidden items
- Full color control for active and inactive states to match any brand
- Horizontal wrapping for headers, vertical stacking for sidebars
- Zero external dependencies, zero network calls — fully certified by Microsoft
- 100% free with no tier restrictions or licensing

### At a Glance
- ✅ Single-select and multi-select modes
- ✅ Horizontal and vertical layout
- ✅ Full color customization
- ✅ "Select All" button
- ✅ Slicer sync across pages
- ✅ High contrast support
- ✅ Keyboard accessible
- ✅ Up to 1,000 values
- ✅ Microsoft certified
- ✅ 100% free

---

## TAB 2: Features

### Interaction
**Single & Multi-select** — Toggle between modes in the Format Pane. In single-select, clicking a chip deselects the previous one. In multi-select, multiple chips can be active simultaneously.

**"Select All" Button** — An optional chip at the start of the list that clears all active filters instantly. The label is fully customizable (e.g., "All", "Reset", "Show all").

**Slicer Sync** — Chip Slicer supports Power BI's native Sync Slicers feature. Add it to the sync group in View → Sync Slicers and filter state is preserved across all linked report pages.

**Keyboard Navigation** — Every chip is keyboard-focusable. Tab to navigate, Enter or Space to toggle. Fully accessible for screen reader users.

**High Contrast Support** — When Power BI's high contrast theme is active, Chip Slicer automatically uses the theme's foreground and background colors, ignoring the custom color settings.

### Appearance
**Horizontal & Vertical Layout** — Horizontal mode wraps chips into rows — ideal for report headers or top-of-page filter bars. Vertical mode stacks chips in a single column — ideal for narrow sidebars.

**Full Color Control** — Set background, border, and text color for both active (selected) and inactive (unselected) states independently. Six color pickers total.

**Chip Dimensions** — Control chip height, border radius, font size, horizontal padding, and the gap between chips. Mix and match to match your report's visual language.

**Landing Page** — When no field is assigned to the Category well, Chip Slicer displays a clean placeholder icon with a hint message instead of leaving a blank white box.

**Theme Friendly** — Default colors work with any Power BI theme. Override as needed to match your brand.

### Technical
**Filtering via BasicFilter** — Selections are passed to Power BI as a standard BasicFilter using `host.applyJsonFilter`. This ensures compatibility with all other visuals and with Power BI's filter state management.

**No External Dependencies** — The visual uses only the Power BI visuals API and no third-party libraries. This eliminates CDN dependencies and ensures the visual works in air-gapped environments.

**Up to 1,000 Values** — The Category field well uses Power BI's `top: 1000` data reduction, which is the platform cap for categorical slicers.

---

## TAB 3: Technical

### Specifications
- API version: 5.10.0
- Package: Microsoft AppSource / `.pbiviz` import
- Certified: Yes (Microsoft Power BI certified visual)
- License: 100% free, no restrictions

### Field Wells
| Field well | Data types | Max values |
|---|---|---|
| Category | Text, number, date, boolean | 1,000 |

### Format Pane Settings (Chip Style)
| Setting | Type | Default |
|---|---|---|
| Multi-select | Toggle | Off |
| Layout | Dropdown (Horizontal / Vertical) | Horizontal |
| Chip height | Number (px) | 34 |
| Border radius | Number (px) | 17 |
| Font size | Number (pt) | 12 |
| Gap | Number (px) | 8 |
| Horizontal padding | Number (px) | 16 |
| Inactive background | Color | #F3F4F6 |
| Inactive border | Color | #E5E7EB |
| Inactive text | Color | #374151 |
| Active background | Color | #378ADD |
| Active border | Color | #378ADD |
| Active text | Color | #FFFFFF |
| Show "All" button | Toggle | On |
| "All" button text | Text input | All |

### Capabilities
- `supportsHighlight: true`
- `supportsSynchronizingFilterState: true`
- `supportsLandingPage: true`
- `supportsKeyboardFocus: true`
- `supportsMultiVisualSelection: true`

### Performance
- DOM is built in memory and swapped atomically — no blank flash during re-render
- No animations or heavy CSS transitions that could block the rendering pipeline
- Minimal dependencies: Power BI API + `powerbi-models` for BasicFilter only

### Privacy & Network
- No external network requests
- No cookies, localStorage, or persistent storage
- No telemetry or analytics
- All data is processed locally within Power BI

### Licensing
- 100% free. No IVisualLicenseManager integration.
- Previously offered a paid Pro tier (removed in v1.4.0.0 — no subscribers existed at removal)

### Compatibility
- Power BI Desktop: all versions supporting API 5.x
- Power BI Service: all regions
- Power BI Mobile: rendering supported; filter interaction depends on app version
- Embedded / Report Server: rendering supported; filter API availability depends on host

### Dependencies
- `powerbi-visuals-api ~5.10.0`
- `powerbi-visuals-utils-formattingmodel 6.0.4`
- `powerbi-models ^2.0.1`

### Support
- Documentation: https://tinocallarisa-web.github.io/chip-slicer/support.html
- Bug reports: https://github.com/tinocallarisa-web/chip-slicer/issues
- Email: support@tcviz.com

---

## TAB 4: Changelog

### [1.4.0.0] — 2026-08-02
**Changed**
- Removed paid licensing model. All features are now completely free for every user.
- Removed IVisualLicenseManager integration and all Free/Pro tier gating.
- Updated Terms of Use and Privacy Policy to remove licensing references.
- Added `support.html` documentation page.

### [1.3.0.0] — 2026-04-22
**Added**
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
