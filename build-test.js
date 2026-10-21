/**
 * build-test.js — Chip Slicer
 *
 * Genera un .pbiviz de TEST que convive con la versión de AppSource:
 *   - GUID: chipSlicerPro_test
 *   - Versión con el último dígito por build (Desktop cachea por guid + versión)
 *
 * Uso:
 *   node build-test.js                  se llama "Chip Slicer (TEST)"
 *   node build-test.js --clean-name     conserva el nombre real, para grabar vídeo
 *
 * El visual es gratuito: no hay nada que parchear en src/. pbiviz.json queda SIEMPRE en
 * estado producción (el script restaura al final, también si se interrumpe).
 */

const fs            = require('fs');
const path          = require('path');
const { execSync }  = require('child_process');

const ROOT          = __dirname;
const PBIVIZ_JSON   = path.join(ROOT, 'pbiviz.json');
const ORIGINAL_GUID = 'chipSlicerPro';
const TEST_GUID     = 'chipSlicerPro_test';

const pbivizOrig = fs.readFileSync(PBIVIZ_JSON, 'utf8');
let restaurado = false;
function restore() {
    if (restaurado) return;
    restaurado = true;
    fs.writeFileSync(PBIVIZ_JSON, pbivizOrig, 'utf8');
    console.log('✅  pbiviz.json restaurado al estado de producción.');
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
    try { process.on(sig, () => { restore(); process.exit(130); }); } catch (e) { /* señal no disponible */ }
}
process.on('exit', restore);

try {
    const pbiviz = JSON.parse(pbivizOrig);
    if (pbiviz.visual.guid !== ORIGINAL_GUID) {
        throw new Error(`GUID inesperado en pbiviz.json: "${pbiviz.visual.guid}" (se esperaba "${ORIGINAL_GUID}")`);
    }
    pbiviz.visual.guid = TEST_GUID;
    const CONTADOR = path.join(ROOT, '.tmp', 'test-build-counter');
    fs.mkdirSync(path.dirname(CONTADOR), { recursive: true });
    const n = (parseInt(fs.existsSync(CONTADOR) ? fs.readFileSync(CONTADOR, 'utf8') : '0', 10) || 0) + 1;
    fs.writeFileSync(CONTADOR, String(n), 'utf8');
    const partes = pbiviz.visual.version.split('.');
    partes[3] = String(Number(partes[3]) + n);
    pbiviz.visual.version = partes.join('.');
    if (!process.argv.includes('--clean-name')) {
        pbiviz.visual.displayName = 'Chip Slicer (TEST)';
    }
    fs.writeFileSync(PBIVIZ_JSON, JSON.stringify(pbiviz, null, 4), 'utf8');
    console.log(`📝  GUID ${TEST_GUID} · versión ${pbiviz.visual.version} · ${pbiviz.visual.displayName}`);

    execSync('npx pbiviz package', { stdio: 'inherit', cwd: ROOT, shell: true });
    console.log('\n✅  Build de TEST en dist/. Power BI lo ve como visual distinto al de AppSource.\n');
} catch (err) {
    console.error('\n❌  Error durante el build de test:', err.message || err);
    process.exitCode = 1;
} finally {
    restore();
}
