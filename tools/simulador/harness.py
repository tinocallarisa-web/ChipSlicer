# -*- coding: utf-8 -*-
"""Simulador Playwright de Chip Slicer 1.7: tarjeta Accessibility (alto contraste On, foco, tamaño mínimo), fx en los
colores de los chips (regla por categoría desde objects[i]), color fijo intacto, pozo Tooltips con identidad, eventos
de render 1:1 y que las plantillas no pisan una regla fx. Datos: Begudes Nord (ficticia), familias de producto.

    node build-test.js
    python tools/simulador/harness.py
"""
import asyncio, io, json, os, sys
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "capturas")
DROP = os.path.join(ROOT, ".tmp", "drop")
FALLOS = []

STUB = r"""
window.__ev = []; window.__persist = []; window.__filters = [];
window.powerbi = { visuals: { plugins: {} }, extensibility: {} };
(function(){
 function mkId(k){ return { __k:k, getKey(){return k;}, getSelector(){return {k};}, equals(o){return !!o && o.__k===k;}, includes(o){ return !!o && o.__k===k; } }; }
 window.__host = {
  eventService: { renderingStarted(){ __ev.push('S'); }, renderingFinished(){ __ev.push('F'); }, renderingFailed(o,m){ __ev.push('X'); console.error('FAILED', m); } },
  createSelectionManager(){ return { select(){ return Promise.resolve([]); }, clear(){ return Promise.resolve(); }, getSelectionIds(){ return []; },
     hasSelection(){ return false; }, registerOnSelectCallback(cb){ window.__onSel = cb; }, showContextMenu(){ return Promise.resolve(); } }; },
  createSelectionIdBuilder(){ const k=[]; return { withCategory(c,i){ k.push(c.source.queryName+'='+c.values[i]); return this; },
     withMeasure(m){ k.push(m); return this; }, withSeries(){ return this; }, createSelectionId(){ return mkId(k.join('|')); } }; },
  createLocalizationManager(){ return { getDisplayName(k){ return k; } }; },
  tooltipService: { enabled(){ return true; }, show(o){ window.__tip = o; }, move(o){ window.__tip = o; }, hide(){} },
  subSelectionService: { subSelect(){}, updateRegionOutlines(){} },
  hostCapabilities: { allowInteractions: true }, locale: window.__locale || 'en-US',
  colorPalette: { isHighContrast: !!window.__sysHC, foreground:{value: window.__sysHC ? '#FFFF00' : '#252423'}, background:{value: window.__sysHC ? '#000000' : '#FFFFFF'},
    foregroundSelected:{value:'#1AEBFF'}, getColor(k){ return {value:'#118DFF'}; } },
  persistProperties(p){ __persist.push(p); }, launchUrl(){},
  applyJsonFilter(f, o, p, a){ __filters.push({f, a}); },
 };
})();
"""

PRODUCTOS = ["Beer", "Craft beer", "Water", "Soft drinks", "Juices", "Wine", "Spirits", "Coffee"]
CAJAS = [1240, 310, 980, 760, 220, 455, 130, 90]
VISITAS = [61, 18, 55, 47, 12, 29, 9, 6]


def dv(objects=None, measure=True, tips=True, fx=None, productos=None, tip_first=False):
    prods = productos or PRODUCTOS
    cat = {"source": {"displayName": "Product family", "queryName": "S.Product", "roles": {"category": True}}, "values": list(prods)}
    if fx:
        cat["objects"] = fx
    vals = []
    if measure:
        vals.append({"source": {"displayName": "Cases", "queryName": "Sum(S.Cases)", "roles": {"measure": True}, "isMeasure": True, "format": "#,0"},
                     "values": CAJAS[:len(prods)]})
    if tips:
        t = {"source": {"displayName": "Visits", "queryName": "Sum(S.Visits)", "roles": {"tooltips": True}, "isMeasure": True, "format": "#,0"},
             "values": VISITAS[:len(prods)]}
        vals = [t] + vals if tip_first else vals + [t]
    return {"metadata": {"columns": [cat["source"]] + [v["source"] for v in vals], "objects": objects or {}},
            "categorical": {"categories": [cat], "values": vals}}


def rgb(h):
    h = h.lstrip("#")
    return f"rgb({int(h[0:2], 16)}, {int(h[2:4], 16)}, {int(h[4:6], 16)})"


def check(name, ok, detail=""):
    print(f"  {'OK   ' if ok else 'FALLO'} {name}{'  — ' + detail if detail else ''}")
    if not ok: FALLOS.append(name)


async def page(browser, data, W=640, H=220, sys_hc=False, name=None, filters=None, view_mode=1, locale="en-US"):
    guid = json.load(io.open(os.path.join(DROP, "pbiviz.json"), encoding="utf-8"))["visual"]["guid"]
    pg = await browser.new_page(viewport={"width": W, "height": H})
    errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.set_content(f"<html><body style='margin:0;background:#FFFFFF'><div id='host' style='position:relative;width:{W}px;height:{H}px;overflow:hidden'></div></body></html>")
    await pg.add_style_tag(path=os.path.join(DROP, "visual.css"))
    await pg.add_script_tag(content=f"window.__sysHC = {json.dumps(sys_hc)}; window.__locale = {json.dumps(locale)};")
    await pg.add_script_tag(content=STUB)
    await pg.add_script_tag(path=os.path.join(DROP, "visual.js"))
    await pg.evaluate("(g) => { window.__v = powerbi.visuals.plugins[g].create({ element: document.getElementById('host'), host: __host }); }", guid)
    pg.__errs = errs
    await upd(pg, data, W, H, filters, view_mode)
    if name:
        os.makedirs(OUT, exist_ok=True)
        await pg.screenshot(path=os.path.join(OUT, name + ".png"))
    return pg


async def upd(pg, data, W=640, H=220, filters=None, view_mode=1):
    await pg.evaluate("([dv, W, H, f, vm]) => __v.update({ dataViews: dv ? [dv] : [], viewport: {width: W, height: H}, type: 2, operationKind: 0, viewMode: vm, jsonFilters: f || [] })",
                      [data, W, H, filters, view_mode])
    await pg.wait_for_timeout(120)


async def eventos(pg, label):
    ev = await pg.evaluate("() => __ev.join('')")
    check(f"{label}: sin errores y eventos de render 1:1", not pg.__errs and ev.count("S") == ev.count("F") and "X" not in ev and ev.count("S") > 0,
          f"eventos {ev} {pg.__errs[:2]}")


CHIPS = """() => Array.from(document.querySelectorAll('.chip-item')).map(c => { const l = c.querySelector('.chip-label'); const b = c.querySelector('.chip-badge');
    const r = c.getBoundingClientRect();
    return { key: c.dataset.key, label: l && l.textContent, active: c.classList.contains('active'), bg: c.style.backgroundColor, color: c.style.color,
             border: c.style.borderColor, fs: parseFloat(getComputedStyle(l).fontSize), bfs: b ? parseFloat(getComputedStyle(b).fontSize) : null,
             h: r.height, x: r.left, y: r.top, w: r.width, lw: l.clientWidth, lsw: l.scrollWidth, ell: getComputedStyle(l).textOverflow }; })"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        SEL = [{"values": ["Beer"]}]

        print("Datos básicos y pozo Value por rol")
        pg = await page(b, dv(tip_first=True), name="01_base", filters=SEL)
        ch = await pg.evaluate(CHIPS)
        beer = next(c for c in ch if c["key"] == "Beer")
        check("un chip por valor más 'All'", len(ch) == len(PRODUCTOS) + 1, str(len(ch)))
        check("el valor del chip sale del pozo Value aunque Tooltips vaya primero (1,240)", beer["label"] == "Beer" and "1,240" in await pg.evaluate("() => document.querySelector('.chip-item[data-key=\"Beer\"] .chip-badge').textContent"))
        check("selección del filtro guardado: Beer activo", beer["active"])
        for i in range(3):
            await upd(pg, dv(tip_first=True), filters=SEL)
        await eventos(pg, "cuatro actualizaciones")
        await pg.close()

        print("Accesibilidad")
        o = {"accessibility": {"highContrast": "on", "focusColor": {"solid": {"color": "#D00000"}}, "focusWidth": 5}, "header": {"show": True}}
        pg = await page(b, dv(o), name="02_hc_on", filters=SEL)
        ch = await pg.evaluate(CHIPS)
        beer = next(c for c in ch if c["key"] == "Beer"); water = next(c for c in ch if c["key"] == "Water")
        check("HC On: chip inactivo blanco con borde y texto negros", water["bg"] == rgb("#FFFFFF") and water["border"] == rgb("#000000") and water["color"] == rgb("#000000"), str(water))
        check("HC On: chip activo negro con texto blanco", beer["bg"] == rgb("#000000") and beer["color"] == rgb("#FFFFFF"), str(beer))
        hd = await pg.evaluate("() => document.querySelector('.chip-header-text').style.color")
        check("HC On: cabecera en negro", hd == rgb("#000000"), hd)
        f = await pg.evaluate("() => { const c = document.querySelector('.chip-slicer-container'); return [c.style.getPropertyValue('--chip-focus'), c.style.getPropertyValue('--chip-focus-w')]; }")
        check("HC On: foco negro con el grosor de la tarjeta (5 px)", f == ["#000000", "5px"], str(f))
        fm = await pg.evaluate("() => __v.getFormattingModel().cards.map(c => c.uid)")
        check("tarjeta Accessibility en el panel", any("accessibility" in u for u in fm), str(fm))
        await eventos(pg, "HC On")
        await pg.close()

        pg = await page(b, dv({"accessibility": {"focusColor": {"solid": {"color": "#D00000"}}, "focusWidth": 4}}))
        await pg.focus(".chip-item[tabindex='0']")
        await pg.keyboard.press("ArrowRight")
        f = await pg.evaluate("() => { const c = document.querySelector('.chip-slicer-container'); const a = document.activeElement; const cs = getComputedStyle(a);"
                              " return [c.style.getPropertyValue('--chip-focus'), c.style.getPropertyValue('--chip-focus-w'), cs.outlineWidth, cs.outlineColor]; }")
        check("foco sin alto contraste: color y grosor de la tarjeta en el contorno", f[0].upper() == "#D00000" and f[1] == "4px" and f[2] == "4px" and f[3] == rgb("#D00000"), str(f))
        await pg.close()

        pg = await page(b, dv(), sys_hc=True, name="03_hc_windows")
        ch = await pg.evaluate(CHIPS)
        check("HC de Windows: borde con el primer plano del sistema", ch[1]["border"] == rgb("#FFFF00") and ch[1]["bg"] == rgb("#000000"), str(ch[1]))
        await pg.close()

        print("Tamaño mínimo del texto")
        o = {"accessibility": {"minTextSize": 18}, "chipSettings": {"fontSize": 9, "chipHeight": 20}, "header": {"show": True, "fontSize": 8}}
        pg = await page(b, dv(o), W=420, H=260, name="04_min_text")
        ch = await pg.evaluate(CHIPS)
        check("chips: texto ≥ 18 px", all(c["fs"] >= 18 for c in ch), str([c["fs"] for c in ch]))
        check("valores (badge): texto ≥ 18 px", all(c["bfs"] is None or c["bfs"] >= 18 for c in ch), str([c["bfs"] for c in ch]))
        hfs = await pg.evaluate("() => parseFloat(getComputedStyle(document.querySelector('.chip-header-text')).fontSize)")
        check("cabecera: texto ≥ 18 px", hfs >= 18, str(hfs))
        check("el chip crece para que quepa el texto (alto ≥ 18×1,3+8)", all(c["h"] >= 18 * 1.3 + 8 - 0.5 for c in ch), str([c["h"] for c in ch][:3]))
        vis = [c for c in ch if c["w"] > 0]
        solapa = [(a["key"], c["key"]) for i, a in enumerate(vis) for c in vis[i + 1:]
                  if a["x"] < c["x"] + c["w"] - 0.5 and c["x"] < a["x"] + a["w"] - 0.5 and a["y"] < c["y"] + c["h"] - 0.5 and c["y"] < a["y"] + a["h"] - 0.5]
        check("ningún chip se solapa con otro", not solapa, str(solapa[:3]))
        await eventos(pg, "tamaño mínimo")
        await pg.close()
        largo = ["Premium imported craft beer selection from small breweries"] + PRODUCTOS[1:3]
        pg = await page(b, dv({"accessibility": {"minTextSize": 20}, "chipSettings": {"layout": "vertical"}}, productos=largo), W=220, H=260, name="05_min_text_largo")
        ch = await pg.evaluate(CHIPS)
        lg = next(c for c in ch if c["label"] == largo[0])
        cw = await pg.evaluate("() => document.querySelector('.chip-slicer-inner').clientWidth")
        check("texto largo: el chip no se sale y la etiqueta se recorta con …", lg["w"] <= cw + 0.5 and lg["lsw"] > lg["lw"] and lg["ell"] == "ellipsis", str(lg))
        await pg.close()

        print("fx en los colores de los chips")
        colores = ["#AA0000", "#00AA00", "#0000AA", "#AAAA00", "#00AAAA", "#AA00AA", "#555555", "#884400"]
        fx = [{"chipSettings": {"defaultBg": {"solid": {"color": c}}, "activeBg": {"solid": {"color": "#111111"}}}} for c in colores]
        pg = await page(b, dv(fx=fx), name="06_fx", filters=SEL)
        ch = {c["key"]: c for c in await pg.evaluate(CHIPS)}
        check("regla fx: cada chip inactivo con su color de fondo", all(ch[pn]["bg"] == rgb(c) for pn, c in zip(PRODUCTOS, colores) if pn != "Beer"),
              str([(k, v["bg"]) for k, v in ch.items()][:4]))
        check("regla fx: el chip activo con el color de su regla activa", ch["Beer"]["bg"] == rgb("#111111"), ch["Beer"]["bg"])
        check("regla fx sin regla de texto: texto legible (negro o blanco) sobre fondo oscuro", ch["Wine"]["color"] in (rgb("#FFFFFF"), rgb("#000000")), ch["Wine"]["color"])
        check("'All' (sin categoría) mantiene el color fijo", ch["\u0000all"]["bg"] != rgb(colores[0]))
        await eventos(pg, "fx")
        await pg.close()

        print("Color fijo intacto (informes de 1.6)")
        o = {"style": {"template": "classic"}, "chipSettings": {"defaultBg": {"solid": {"color": "#123456"}}, "defaultText": {"solid": {"color": "#FFFFFF"}}}}
        pg = await page(b, dv(o))
        ch = await pg.evaluate(CHIPS)
        check("sin regla: los chips usan el color fijo guardado a nivel general", all(c["bg"] == rgb("#123456") for c in ch if not c["active"]), str(ch[1]["bg"]))
        d = await pg.evaluate("""() => { const out = {}; __v.getFormattingModel().cards.forEach(c => (c.groups || []).forEach(g => (g.slices || []).forEach(s => {
              const p = s.control && s.control.properties; const d = p && p.descriptor;
              if (d && d.objectName === 'chipSettings' && ['defaultBg','defaultBorder','activeBg','defaultText','activeText'].includes(d.propertyName))
                out[d.propertyName] = { alt: d.altConstantValueSelector === null, kind: d.instanceKind, sel: JSON.stringify(d.selector || null), v: p.value && p.value.value }; }))); return out; }""")
        check("panel: el color fijo se recuerda (#123456)", (d.get("defaultBg") or {}).get("v", "").upper() == "#123456", str(d.get("defaultBg")))
        check("descriptor fx: ConstantOrRule, selector comodín y altConstantValueSelector null en los 4 colores",
              all(d.get(k, {}).get("alt") and d.get(k, {}).get("kind") == 3 and "dataViewWildcard" in d.get(k, {}).get("sel", "") for k in ["defaultBg", "activeBg", "defaultText", "activeText"]), json.dumps(d)[:300])
        check("los bordes no llevan fx", "dataViewWildcard" not in d.get("defaultBorder", {}).get("sel", ""))
        await pg.close()

        print("Las plantillas no pisan la regla fx")
        fx2 = [{"chipSettings": {"defaultBg": {"solid": {"color": c}}}} for c in colores]
        pg = await page(b, dv({"style": {"template": "aurora"}}, fx=fx2), name="07_plantilla_y_fx")
        ch = {c["key"]: c for c in await pg.evaluate(CHIPS)}
        check("plantilla Aurora + regla: los chips llevan el color de la regla", all(ch[pn]["bg"] == rgb(c) for pn, c in zip(PRODUCTOS, colores)), ch["Water"]["bg"])
        await upd(pg, dv({"style": {"template": "ledger"}}, fx=fx2))
        rem = await pg.evaluate("() => JSON.stringify(__persist)")
        persist = json.loads(rem)
        sels = [r.get("selector") for x in persist for r in (x.get("remove") or [])]
        check("al elegir otra plantilla solo se borra el color fijo (selector general), nunca la regla", persist and all(s is None for s in sels), rem[:200])
        ch = {c["key"]: c for c in await pg.evaluate(CHIPS)}
        check("con la plantilla nueva la regla sigue mandando", ch["Water"]["bg"] == rgb(colores[2]), ch["Water"]["bg"])
        await eventos(pg, "plantillas")
        await pg.close()

        print("Tooltips")
        pg = await page(b, dv())
        await pg.hover(".chip-item[data-key='Water']")
        tip = await pg.evaluate("() => ({ ids: (__tip.identities || []).map(i => i.getKey()), items: __tip.dataItems })")
        check("tooltip con la identidad del chip (tooltips de página)", tip["ids"] == ["S.Product=Water"], str(tip["ids"]))
        nombres = {i["displayName"]: i["value"] for i in tip["items"]}
        check("tooltip con la medida extra del pozo Tooltips (Visits 55)", nombres.get("Visits") == "55", str(nombres))
        check("tooltip con la categoría y el valor", nombres.get("Product family") == "Water" and nombres.get("Cases") == "980", str(nombres))
        badge = await pg.evaluate("() => document.querySelector('.chip-item[data-key=\"Water\"] .chip-badge').textContent")
        check("la medida de Tooltips no se pinta en el chip", badge == "980", badge)
        await pg.close()
        pg = await page(b, dv(measure=False))
        badge = await pg.evaluate("() => document.querySelectorAll('.chip-badge').length")
        fm = await pg.evaluate("() => __v.getFormattingModel().cards.filter(c => c.uid.indexOf('badge') >= 0).length")
        check("solo Tooltips (sin Value): sin cifras en los chips ni tarjeta Values", badge == 0 and fm == 0, f"{badge} {fm}")
        await eventos(pg, "solo Tooltips")
        await pg.close()

        print("Marcadores: el callback de selección no escribe en el informe")
        pg = await page(b, dv(), filters=SEL)
        n0 = await pg.evaluate("() => __persist.length")
        await pg.evaluate("() => window.__onSel && window.__onSel([])")
        n1 = await pg.evaluate("() => __persist.length")
        check("registerOnSelectCallback no llama a persistProperties", n0 == n1, f"{n0} → {n1}")
        await pg.close()

        print("Texto que encoge con el visual (1.7)")
        for (W, H, hdr) in ((640, 220, True), (640, 44, False), (640, 60, True), (300, 36, False)):
            pg = await page(b, dv({"header": {"show": hdr}}), W=W, H=H, name=f"10_escala_{W}x{H}")
            r = await pg.evaluate("""() => { const c = Array.from(document.querySelectorAll('.chip-item')); if (!c.length) return null;
                const fs = Math.max(...c.map(e => parseFloat(getComputedStyle(e).fontSize)));
                const b = c[0].getBoundingClientRect(); const lbl = c[0].querySelector('.chip-label');
                return { fs, alto: b.height, abajo: b.bottom, cabe: b.bottom <= innerHeight + 0.5,
                         cortado: lbl ? lbl.scrollHeight > lbl.clientHeight + 1 : false }; }""")
            if H >= 200:
                check(f"{W}×{H}: con sitio, tamaños de siempre (sin encoger)", bool(r) and r["fs"] >= 12, str(r))
            else:
                check(f"{W}×{H}: la primera fila de chips entra en el alto", bool(r) and r["cabe"], str(r))
                check(f"{W}×{H}: letra ≥ 8 px y sin cortar", bool(r) and r["fs"] >= 8 and not r["cortado"], str(r))
            await pg.close()

        print("Textos en español (bundle)")
        pg = await page(b, None, locale="es-ES", W=640, H=360)
        t = await pg.evaluate("() => document.body.innerText")
        check("pantalla de inicio en español (texto del bundle)", "Filtra la página" in t, t[:80])
        await eventos(pg, "pantalla de inicio")
        await pg.close()

        await b.close()
    print(f"\n{len(FALLOS)} fallos" + (": " + ", ".join(FALLOS) if FALLOS else ""))
    sys.exit(1 if FALLOS else 0)


if __name__ == "__main__":
    asyncio.run(main())
