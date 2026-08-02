@echo off
setlocal

echo ==========================================
echo  Chip Slicer - Build todas versiones
echo ==========================================

REM --- VERSION TEST ---
echo.
echo [1/2] Compilando VERSION TEST (guid: chipSlicerFree_test)...
copy /Y pbiviz_test.json pbiviz.json >nul
npx pbiviz package
if %ERRORLEVEL% NEQ 0 (
    echo ERROR en la version test.
    copy /Y pbiviz_prod.json pbiviz.json >nul
    exit /b 1
)
if exist "dist\chipSlicerFree_test.pbiviz" del "dist\chipSlicerFree_test.pbiviz"
ren "dist\chipSlicerFree.pbiviz" "chipSlicerFree_test.pbiviz" 2>nul
echo [1/2] Test listo: dist\chipSlicerFree_test.pbiviz

REM --- VERSION PRODUCCION ---
echo.
echo [2/2] Compilando VERSION PRODUCCION (guid: chipSlicerFree)...
copy /Y pbiviz_prod.json pbiviz.json >nul
npx pbiviz package
if %ERRORLEVEL% NEQ 0 (
    echo ERROR en la version produccion.
    exit /b 1
)
echo [2/2] Produccion lista: dist\chipSlicerFree.pbiviz

echo.
echo ==========================================
echo  Builds completados:
echo    dist\chipSlicerFree_test.pbiviz  (test)
echo    dist\chipSlicerFree.pbiviz       (produccion)
echo ==========================================
endlocal
