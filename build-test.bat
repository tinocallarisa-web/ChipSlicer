@echo off
echo [TEST] Compilando version test (guid: chipSlicerPro_test)...
copy /Y pbiviz_test.json pbiviz.json >nul
npx pbiviz package
copy /Y pbiviz_prod.json pbiviz.json >nul
echo [TEST] Listo. El .pbiviz de test esta en dist/
