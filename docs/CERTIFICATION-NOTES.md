# Certification notes — Chip Slicer 1.7.0.0

The block below is what is pasted in Partner Center (docs/CERTIFICATION-NOTES-SHORT.txt).

```
Chip Slicer 1.7.0.0 - GUID chipSlicerPro
Repo, branch certification: https://github.com/tinocallarisa-web/ChipSlicer/tree/certification
Support: https://tinocallarisa-web.github.io/ChipSlicer/support.html
Privacy: https://tinocallarisa-web.github.io/ChipSlicer/privacy.html
Terms: https://tinocallarisa-web.github.io/ChipSlicer/terms.html
Video: https://www.youtube.com/watch?v=cbJ_VHPA5Sk

WHY THIS SUBMISSION
Replaces 1.6.0.0. New: Accessibility card, fx on chip colours, Tooltips well and
report page tooltips. API 5.11.1.

TESTING
1. Sample .pbix: click a chip: the page filters. Again: clears. Ctrl+click: several.
Keys: Tab, arrows, Enter, Esc, Shift+F10.
2. Format > Accessibility > High contrast = On: chips black on white, active chip black.
Focus color/width: Tab into the slicer, the ring changes.
3. Minimum text size = 20 with Chip Style font 9: chips, header and values grow;
taller chips, long labels end with "...", no overlap.
4. Chip Style > Colors > Inactive background > fx > Rules on a measure: each chip takes
its colour. Change Style template: the rule stays. Remove fx: fixed colour returns.
5. Measure in Tooltips: hover a chip, the value is in the tooltip. Page tooltip
(Format > General > Tooltips > Report page): shows the hovered chip's data.
6. Windows high contrast: system colours win over rules.
7. Remove the field: start screen. allowInteractions false: filter unchanged.

CAPABILITIES CHANGES IN 1.7
dataRoles: tooltips (Measure, new). tooltips.roles = [tooltips].
chipSettings defaultBg, defaultText, activeBg, activeText: rule (fx), selector
createDataViewWildcardSelector(InstancesAndTotals), fixed colour general
(altConstantValueSelector null): 1.6 reports keep colours.
accessibility object (new): highContrast, focusColor, focusWidth, minTextSize.
Nothing renamed or removed.

FILTER
BasicFilter "In" (applyJsonFilter) on Category. State from options.jsonFilters.

PERSISTPROPERTIES
Only on a click in the tips bar and once when the template is changed while editing
(general selector: fx rules are never removed). Never in a selection callback.

PRIVACY
No network, telemetry or storage. privileges: []. No innerHTML. Links only on click
(host.launchUrl). ESLint clean; npm audit 0.

LICENSING
Free. No IVisualLicenseManager, no gating.

RENDERING EVENTS 1:1
One renderingStarted and one Finished/Failed per update(). The selection callback
only repaints.
Full notes: docs/CERTIFICATION-NOTES.md
```

CAPABILITIES CHANGES IN 1.7
- dataRoles: new "tooltips" (Measure, no max). dataViewMappings.categorical.values.select also binds "tooltips";
  tooltips.roles = ["tooltips"]. The visual finds the Value measure by role (roles.measure), never by position.
- objects.chipSettings defaultBg, defaultText, activeBg, activeText: "rule" (inputRole measure, output selector
  category). In the Format pane they are ConstantOrRule with the selector made by
  dataViewWildcard.createDataViewWildcardSelector(InstancesAndTotals) (powerbi-visuals-utils-dataviewutils) and
  altConstantValueSelector null, so the fixed colour is still saved at the general level (1.6 reports unchanged).
  The rule colour is read per chip from categorical.categories[0].objects[i].chipSettings and wins over the fixed
  colour and the template. High contrast wins over the rule. Borders have no fx.
- objects.accessibility (new): highContrast (auto | on), focusColor, focusWidth (1-6), minTextSize (6-24).
  "on" draws black on white without the Windows theme; Windows high contrast (colorPalette.isHighContrast) still wins.
- Nothing renamed, moved or removed.

PERSISTPROPERTIES IN 1.7
Unchanged. When a template is chosen while editing, the remove uses selector null: fx rules are never removed.

TOOLTIPS IN 1.7
tooltipService.show/move with dataItems (category, Value, Tooltips measures formatted with the model's format) and
identities: [the chip's selection id], so report page tooltips receive the chip.

HISTORY: CAPABILITIES CHANGES IN 1.6
- objects.chipSettings: new "forceSelection" (bool, default false) and "collapse" (bool, default true).
- objects.style.template: the enumeration gains "report" (Report theme), which is now the default value, and
  "boardroom", "ledger", "editorial", "signal", "aurora", "terrace" (the TCViz collection styles; static colour sets
  in src/settings.ts TEMPLATES, flat, no shadow; Ledger and Editorial also set fontFamily to Georgia, serif).
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
clean. npm audit: 0 vulnerabilities (1.7, after npm audit fix).
