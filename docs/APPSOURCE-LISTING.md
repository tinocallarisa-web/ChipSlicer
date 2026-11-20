# Chip Slicer — ficha de AppSource (1.7.0.0, borrador 20-11-2026, aún no enviada)

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

Most readers want the same starting point every time: this year, their region, the open cases. Chip Slicer opens on
the values you choose, even after the reader cleared them last time, and shows every option as a button, with the value
of a measure on each chip and a look picked in one click.

Chip Slicer turns a field into a row of buttons — chips — that filter the page with one click. It is free for
everyone, with every feature: no Pro tier, no watermark.

WHAT IT ADDS TO A SLICER
• Default selection: type "2026" or "Spain, France" and the report opens with them selected. If the reader clears
  it, it stays clear until the page is opened again.
• Force selection: the slicer always keeps a value selected — your default selection, or else the first value. The
  "All" chip and the clear button are hidden, so the page never shows everything mixed. Off by default.
• "+N" for chips that do not fit (horizontal layout with wrapping): in a narrow strip the last chips are grouped into a "+N" chip. One click shows them
  all, "Show less" closes. Selected chips are never hidden.
• Clear button (✕) and an optional "All" chip.
• Counts on the chips: put a measure in Value and each chip shows its count or total, with your model's format.
• Conditional formatting (fx) on chip backgrounds and text, active and inactive: rules, gradient or field value,
  chip by chip.
• Sort by data order, A to Z, Z to A or by value.
• Horizontal, vertical or grid layout, with automatic or fixed columns, one scrolling row, stretch to fill and
  alignment. Long labels end with "…".
• Thirteen style templates. Report theme, the default, takes the colors of your report theme, light or dark, like
  a native visual. Boardroom, Ledger, Editorial, Signal, Aurora and Terrace are the styles of the TCViz collection,
  the same looks as in KPI Card and Histogram, so a page that uses them looks consistent. Also Classic, Outline,
  Soft, Square, Segmented and Dark, plus colors, font, check mark and shadow.
• Optional header.

WORKS LIKE A SLICER
• A standard Power BI filter: it filters the other visuals and works with sync slicers, bookmarks and edit
  interactions.
• Single or multi-select; Ctrl+click adds.
• Text, numbers, dates and hierarchy levels; codes keep their leading zeros.
• On-object formatting: click a chip or the header to format it on the canvas.
• Tooltips with the value, the measure and any measures in the Tooltips well; report page tooltips too.
• Right-click a chip for the Power BI context menu.
• Chips dim when another visual on the page highlights part of the data.
• Up to 1,000 values; one field in Category, one optional measure in Value.

ACCESSIBLE AND IN YOUR LANGUAGE
• Keyboard: one Tab stop, arrow keys, Enter or Space, Escape to clear (unless Force selection is on; with "+N" open,
  Escape first closes it), Shift+F10 for the context menu. "+N" opens with Enter or Space.
• Screen readers hear a list with each chip's state.
• Accessibility card: high contrast (Windows theme, or black on white on demand), focus color and width, and a
  minimum text size; chips grow so the text fits.
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

WHAT'S NEW IN 1.7.0.0
Accessibility card (high contrast on demand, focus ring, minimum text size). Conditional formatting (fx) on chip
colors. Tooltips well and report page tooltips. Reports made with 1.6 keep their look.

## Palabras clave (3)

Se mantienen las de la 1.5: ninguna novedad de la 1.6 ni de la 1.7 es una búsqueda con más volumen que estas.

1. `button slicer` — lo teclea quien quiere botones en vez de la lista desplegable del nativo: problema concreto.
2. `default selection` — el nativo no la tiene y es una queja clásica de Power BI; quien la busca ya tiene el problema.
3. `filter` — genérico, por volumen. No `slicer`: ya está en el nombre de la oferta y como palabra clave no suma
   (Tino, 22-10). Lo escribe además quien no conoce el término de Power BI.

## Vídeo

URL canónica `https://www.youtube.com/watch?v=<id>` (nunca acortada). El vídeo sigue siendo el de la 1.5 (no muestra
Report theme, +N, Force selection ni lo de la 1.7; se puede dejar):
`https://www.youtube.com/watch?v=cbJ_VHPA5Sk`.

## Notas para la certificación

Ver `docs/CERTIFICATION-NOTES-SHORT.txt` (el campo se vacía en cada reenvío: pegarlo siempre).

## Imágenes (Partner Center → Offer listing)

- Logo 300×300: `assets/icon_300x300.png` (icono nuevo de la serie)
- Capturas 1366×768: `assets/Screenshot_1.png` y `assets/chip-slicer-infographic.png` (fuente: `docs/infographic.html`).
  La infografía cambia en la 1.6 (trece plantillas, +N, Force selection): volver a exportar el PNG desde
  `docs/infographic.html` antes de subirla.

## Qué hay que pegar a mano en Partner Center (1.7.0.0)

1. Offer listing → **Description**: el HTML de `docs/APPSOURCE-DESCRIPTION.html` (generado con
   `python C:/tcviz/utillaje/ficha_html.py`), nunca el texto de arriba (cambia: fx, Tooltips, Accessibility,
   WHAT'S NEW IN 1.7.0.0).
2. Technical configuration / Submission → **Notes for certification**: `docs/CERTIFICATION-NOTES-SHORT.txt` (siempre).
3. Package: el `.pbiviz` 1.7.0.0 y el `.pbix` de muestra **guardado con la 1.7.0.0** (hoy lleva la 1.6.0.0).
4. Sin cambios, solo comprobar: resumen de búsqueda, palabras clave, vídeo (URL canónica de arriba), enlace de
   soporte (`support.html`), capturas.
