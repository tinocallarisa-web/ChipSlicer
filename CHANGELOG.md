# Changelog — Chip Slicer

All notable changes to this project will be documented in this file.

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
