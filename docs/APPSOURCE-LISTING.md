# Chip Slicer — ficha de AppSource (1.6.0.0, borrador 05-11-2026, aún no enviada)

Texto para pegar en Partner Center → oferta Chip Slicer → Offer listing. **Editar este fichero no cambia la oferta:**
cada campo hay que pegarlo a mano en la consola.

Comprobar también en Partner Center:
- **Enlace de soporte de la oferta**: OKviz lee `.../ChipSlicer/privacy.html` como soporte (21-10). Debe ser
  `https://tinocallarisa-web.github.io/ChipSlicer/support.html`.
- **Nombre de la oferta**: el marketplace y el CRM lo muestran como "ChipSlicer Pro" y es gratis. Propuesta:
  `Chip Slicer by TCViz`. Si el nombre no se puede cambiar en una oferta publicada, dejarlo y explicarlo en la FAQ (ya está).

---

## Nombre de la oferta

Chip Slicer by TCViz

## Resumen de resultados de búsqueda (≤ 100)

Free button slicer for Power BI: default or forced selection, +N for overflow, report theme colors.

## Descripción (≤ 5.000)

The native slicer makes the reader open a list to filter, and it always opens with nothing selected: every report
starts on "all years" even when everyone wants this year. Buttons are faster, and a sensible starting point saves a
click on every visit.

Chip Slicer turns a field into a row of buttons — chips — that filter the page with one click. It is free for
everyone, with every feature: no Pro tier, no watermark.

WHAT IT ADDS TO A SLICER
• Default selection: type "2026" or "Spain, France" and the report opens with them selected. If the reader clears
  it, it stays clear until the page is opened again.
• Force selection: the slicer always keeps a value selected — your default selection, or else the first value. The
  "All" chip and the clear button are hidden, so the page never shows everything mixed. Off by default.
• "+N" for chips that do not fit: in a narrow strip the last chips are grouped into a "+N" chip. One click shows them
  all, "Show less" closes. Selected chips are never hidden.
• Clear button (✕) and an optional "All" chip.
• Counts on the chips: put a measure in Value and each chip shows its count or total, with your model's format.
  Items without a value are hidden.
• Sort by data order, A to Z, Z to A or by value.
• Horizontal, vertical or grid layout, with automatic or fixed columns, one scrolling row, stretch to fill and
  alignment. Long labels end with "…".
• Seven style templates. Report theme, the default, takes the colors of your report theme, light or dark, like a
  native visual. Also Classic, Outline, Soft, Square, Segmented and Dark, plus colors, font, check mark and shadow.
• Optional header.

WORKS LIKE A NATIVE SLICER
• A standard Power BI filter: sync slicers, bookmarks, edit interactions and the filter pane all work.
• Single or multi-select; Ctrl+click adds.
• Text, numbers, dates and hierarchy levels; codes keep their leading zeros.
• On-object formatting: click a chip or the header to format it on the canvas.
• Tooltips with the value and the measure.

ACCESSIBLE AND IN YOUR LANGUAGE
• Keyboard: one Tab stop, arrow keys, Enter or Space, Escape to clear, Shift+F10 for the context menu. "+N" opens
  with Enter or Space and closes with Escape.
• Screen readers hear a list with each chip's state.
• High-contrast themes.
• 12 languages: English, Spanish, Portuguese, French, German, Italian, Dutch, Polish, Japanese, Chinese, Korean.

NEED SEVERAL LEVELS?
For country → region → city with expand and collapse, see Chip Slicer Hierarchy by TCViz.

PRIVACY
No network calls, no telemetry, no cookies. Your data never leaves Power BI. The links on the start screen open only
when you click them.

GETTING STARTED
1. Drag a column into Category: one chip per value.
2. Optional: drag a measure into Value to show counts.
3. Format pane → Style template: keep Report theme or pick another look in one click.

Documentation, FAQ and use cases: https://tinocallarisa-web.github.io/ChipSlicer/support.html
Support: support@tcviz.com — a person answers.

WHAT'S NEW IN 1.6
Report theme template, now the default: the chips take your report theme's colors. "+N" groups the chips that do not
fit. Force selection keeps one value always selected. The clear button follows the chip colors. Reports that never
chose a template take Report theme after the update; choose Classic to keep the earlier look. Colors set by hand are
kept.

## Palabras clave (3)

Se mantienen las de la 1.5: ninguna novedad de la 1.6 es una búsqueda con más volumen que estas.

1. `button slicer` — lo teclea quien quiere botones en vez de la lista desplegable del nativo: problema concreto.
2. `default selection` — el nativo no la tiene y es una queja clásica de Power BI; quien la busca ya tiene el problema.
3. `filter` — genérico, por volumen. No `slicer`: ya está en el nombre de la oferta y como palabra clave no suma
   (Tino, 22-10). Lo escribe además quien no conoce el término de Power BI.

## Vídeo

URL canónica `https://www.youtube.com/watch?v=<id>` (nunca acortada). El vídeo sigue siendo el de la 1.5 (no muestra
Report theme, +N ni Force selection; se puede dejar):
`https://www.youtube.com/watch?v=cbJ_VHPA5Sk`.

## Notas para la certificación

Ver `docs/CERTIFICATION-NOTES-SHORT.txt` (el campo se vacía en cada reenvío: pegarlo siempre).

## Imágenes (Partner Center → Offer listing)

- Logo 300×300: `assets/icon_300x300.png` (icono nuevo de la serie)
- Capturas 1366×768: `assets/Screenshot_1.png` y `assets/chip-slicer-infographic.png` (fuente: `docs/infographic.html`).
  La infografía cambia en la 1.6 (siete plantillas, +N, Force selection): volver a exportar el PNG desde
  `docs/infographic.html` antes de subirla.

## Qué hay que pegar a mano en Partner Center (1.6.0.0)

1. Offer listing → **Search results summary**: el resumen de arriba (cambia).
2. Offer listing → **Description**: la descripción de arriba entera (cambia: Force selection, +N, siete plantillas,
   WHAT'S NEW IN 1.6).
3. Offer listing → **Screenshots**: la infografía re-exportada (cambia).
4. Technical configuration / Submission → **Notes for certification**: `docs/CERTIFICATION-NOTES-SHORT.txt` (siempre).
5. Package: el `.pbiviz` 1.6.0.0 y el `.pbix` de muestra.
6. Sin cambios, solo comprobar: palabras clave, vídeo (URL canónica de arriba), enlace de soporte (`support.html`).
