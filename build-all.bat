@echo off
setlocal

echo ==========================================
echo  Chip Slicer - Build todas versiones
echo ==========================================

REM --- VERSION TEST ---
echo.
echo [1/2] Compilando VERSION TEST (guid: chipSlicerPro_test)...
copy /Y pbiviz_test.json pbiviz.json >nul
npx pbiviz package
if %ERRORLEVEL% NEQ 0 (
    echo ERROR en la version test.
    copy /Y pbiviz_prod.json pbiviz.json >nul
    exit /b 1
)
if exist "dist\chipSlicerPro_test.pbiviz" del "dist\chipSlicerPro_test.pbiviz"
ren "dist\chipSlicerPro.pbiviz" "chipSlicerPro_test.pbiviz" 2>nul
echo [1/2] Test listo: dist\chipSlicerPro_test.pbiviz

REM --- VERSION PRODUCCION ---
echo.
echo [2/2] Compilando VERSION PRODUCCION (guid: chipSlicerPro)...
copy /Y pbiviz_prod.json pbiviz.json >nul
npx pbiviz package
if %ERRORLEVEL% NEQ 0 (
    echo ERROR en la version produccion.
    exit /b 1
)
echo [2/2] Produccion lista: dist\chipSlicerPro.pbiviz

echo.
echo ==========================================
echo  Builds completados:
echo    dist\chipSlicerPro_test.pbiviz  (test)
echo    dist\chipSlicerPro.pbiviz       (produccion)
echo ==========================================
endlocal
