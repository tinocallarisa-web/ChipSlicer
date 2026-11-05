# Certification notes — Chip Slicer 1.6.0.0

The block below is what is pasted in Partner Center (docs/CERTIFICATION-NOTES-SHORT.txt).

```
Chip Slicer 1.6.0.0 - GUID chipSlicerPro
Repo, branch certification: https://github.com/tinocallarisa-web/ChipSlicer/tree/certification
Docs: https://tinocallarisa-web.github.io/ChipSlicer/support.html (+privacy.html, terms.html, changelog.html)
Video: https://www.youtube.com/watch?v=cbJ_VHPA5Sk

WHY THIS SUBMISSION
Replaces 1.5.0.0. New: Report theme template (now the default), "+N" chip for chips
that do not fit, Force selection. Clear button takes the chip colours. API 5.11.1.

TESTING
1. Sample .pbix: click a chip: the page filters. Again: clears.
2. Multi-select or Ctrl+click: several chips. X and "All" clear. Keyboard: Tab, arrows,
Enter/Space, Esc, Shift+F10.
3. Default selection = a chip value: applied when the slicer loads with no filter.
4. Measure in Value: number on each chip; Sort > Value.
5. Style template > Outline, then Report theme: chips follow the theme. Edit mode:
tips bar, close with X. Format mode: click a chip (on-object).
6. Selection > Force selection on: "All" and X disappear, the first value is selected;
clicking it does not clear.
7. Layout Horizontal, Wrap on, narrow box: a "+N" chip appears. Click: all chips with
"Show less" first; click it or Esc: closes.
8. Remove the field: start screen. allowInteractions false: filter unchanged.

CAPABILITIES CHANGES IN 1.6
chipSettings.forceSelection (bool, new), chipSettings.collapse (bool, new),
style.template enumeration gains "report" (now the default). Nothing renamed or removed.

FILTER
BasicFilter "In" via applyJsonFilter on the Category column, original value types.
Selection state comes from options.jsonFilters.
Force selection applies it with applyJsonFilter (as Default selection does), at most
once per empty state, never in format mode or without allowInteractions.

PERSISTPROPERTIES
Only on a click in the tips bar and once when the template is changed while editing.
Never in a selection callback. +N state is local, never persisted.

PRIVACY
No network, telemetry, cookies or storage. privileges: []. No innerHTML. Links open only
on click via host.launchUrl. ESLint clean; npm audit --omit=dev 0.

LICENSING
Free. No IVisualLicenseManager, no gating.

RENDERING EVENTS 1:1
One renderingStarted and one Finished/Failed per update(). The bookmark callback only
repaints chips and raises none.
```

CAPABILITIES CHANGES IN 1.6
- objects.chipSettings: new "forceSelection" (bool, default false) and "collapse" (bool, default true).
- objects.style.template: the enumeration gains "report" (Report theme), which is now the default value.
- Nothing renamed, moved or removed. dataRoles, dataViewMappings (top 1000 categories) and the rest of the 1.5
  capabilities are unchanged.

FORCE SELECTION (chipSettings.forceSelection)
When on and no valid value is selected (new report, a bookmark without a filter, or the selected value disappears
because another slicer filtered this one), the visual selects the Default selection if it is set, otherwise the first
non-blank value in the displayed order, and applies it with applyJsonFilter, as Default selection already does. At most
once per empty state (the value applied is remembered, so a host that does not take the filter cannot cause a loop).
Never in format mode, never when allowInteractions is false. The "All" chip, the "'All' button text" setting and the
clear button are hidden (in the visual and in the Format pane); clicking the selected chip or Escape does not clear,
and with Multi-select the last selected value cannot be removed. Nothing is persisted for it.

"+N" (chipSettings.collapse)
Horizontal layout with Wrap on only. When the chips need more rows than the viewport has, the last ones are grouped
into a "+N" chip; click, Enter or Space shows them all with vertical scroll and a "Show less" chip first; Escape or
"Show less" closes. Selected chips are never hidden; if even they do not fit, the list scrolls as in 1.5. Opening
moves keyboard focus to the first revealed chip; closing returns it to "+N". The open/closed state is a local field of
the visual instance: never persisted, no filter, no selection change. Vertical, Grid or Wrap off: unchanged.

REPORT THEME TEMPLATE (style.template = "report")
Colours come from host.colorPalette: the selected chip uses the theme's first data colour with black or white text,
whichever contrasts more; inactive chips, header and clear button use the theme's page colours. No shadow. Values
saved by the author in chipSettings still win over the template, as with every template. Because it is the new
default, reports that never chose a template change look after the update; Classic keeps the 1.4/1.5 look.

PERSISTPROPERTIES IN 1.6
Unchanged: only from a click in the tips bar (template, close) and once when the template is changed while editing
(clears the settings that template defines). Never in a selection callback. Neither Force selection nor "+N" persists
anything.

HISTORY: CAPABILITIES CHANGES IN 1.5
- dataRoles: "category" (Grouping, unchanged) + new optional "measure" (Measure, max 1).
- dataViewMappings: categorical; conditions category max 1, measure max 1; top 1000 categories.
- objects: "general" (filter + formatString for dynamic measure formats), "chipSettings" (all 1.4 properties kept,
  new: showClear, defaultSelection, sort, columns, wrap, chipFill, align, fontFamily, showCheck, shadow; layout enum
  gains "grid"), new "header", "badge", "style".
- supportsOnObjectFormatting + enablePointerEventsFormatMode; tooltips (default, canvas); supportsKeyboardFocus,
  supportsLandingPage, supportsSynchronizingFilterState, supportsMultiVisualSelection unchanged.

DEFAULT SELECTION
Applied with applyJsonFilter inside update() only when (a) the text is set, (b) the slicer has no filter in
options.jsonFilters, (c) a chip matches, (d) interactions are allowed and not in format mode. Applied once per text
while the visual instance lives: clearing afterwards is respected until the page or report is
opened again (new instance), when it applies again. Nothing is persisted for it. While editing, changing the text applies the new default.

ON-OBJECT
HtmlSubSelectionHelper; sub-selectable: chips, header, chip value. In format mode clicks do not filter, tooltips and
context menu are off. Shortcuts navigate to "Visual-<object>-card".

LOCALIZATION
stringResources for en-US, es-ES, pt-BR, pt-PT, fr-FR, de-DE, it-IT, nl-NL, pl-PL, ja-JP, zh-CN, ko-KR. Texts drawn by
the visual itself also ship in src/strings.ts (generated by tools/i18n.py).

BUILD
powerbi-visuals-tools 7.2.1, API 5.11.1, TypeScript 5.9, ESLint 10 + eslint-plugin-powerbi-visuals (recommended),
clean. npm audit: 0 in production dependencies; the remaining advisories are in the pbiviz dev server (braces), with
no fixed version published.
