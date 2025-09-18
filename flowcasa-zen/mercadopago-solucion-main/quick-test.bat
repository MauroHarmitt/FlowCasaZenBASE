@echo off
echo 🧪 PRUEBA RÁPIDA DEL SISTEMA
echo =============================
echo.

echo 🔍 Verificando que el servidor esté corriendo...
curl -s http://localhost:3001/health >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Servidor no está corriendo
    echo 🔧 Ejecuta: start-complete-system.bat
    pause
    exit /b 1
)
echo ✅ Servidor funcionando

echo.
echo 🔍 Verificando que ngrok esté activo...
curl -s http://127.0.0.1:4040/api/tunnels >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ngrok no está activo
    echo 🔧 Ejecuta: start-complete-system.bat
    pause
    exit /b 1
)
echo ✅ ngrok funcionando

echo.
echo 🧪 Creando pago de prueba...
node test-sandbox-payment.js

echo.
echo ✅ ¡Prueba completada!
echo.
echo 📋 Próximos pasos:
echo   1. Copia la URL de pago de arriba
echo   2. Compártela con tus clientes
echo   3. Usa las tarjetas de prueba para testing
echo.
pause
