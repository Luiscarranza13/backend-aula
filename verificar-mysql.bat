@echo off
echo Verificando si MySQL esta corriendo...
echo.
netstat -ano | findstr :3306
if %errorlevel% equ 0 (
    echo ✅ MySQL esta corriendo en el puerto 3306
) else (
    echo ❌ MySQL NO esta corriendo
    echo.
    echo Por favor:
    echo 1. Abre Laragon
    echo 2. Haz clic en "Start All"
    echo 3. Espera a que MySQL este en verde
)
pause
