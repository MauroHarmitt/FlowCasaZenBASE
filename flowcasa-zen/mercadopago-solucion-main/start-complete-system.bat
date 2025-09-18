@echo off
echo 🚀 INICIANDO SISTEMA COMPLETO FLOWCASZEN
echo ==========================================
echo.

echo 📋 Verificando dependencias...

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📥 Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

REM Verificar ngrok
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ngrok no está instalado
    echo 📥 Descarga ngrok desde: https://ngrok.com/download
    pause
    exit /b 1
)
echo ✅ ngrok encontrado

echo.
echo 🔧 Iniciando servidor de pagos en puerto 3001...
start "Servidor Pagos" cmd /k "echo 🛒 Servidor de Pagos FlowCasaZen && node server.js"

echo ⏳ Esperando 5 segundos para que el servidor inicie...
timeout /t 5 /nobreak >nul

echo 🌐 Iniciando ngrok para el servidor de pagos...
start "Ngrok Pagos" cmd /k "echo 🌐 Ngrok para Servidor de Pagos && ngrok http 3001"

echo ⏳ Esperando 3 segundos para que ngrok inicie...
timeout /t 3 /nobreak >nul

echo 🔄 Actualizando configuración con URLs de ngrok...
node update-ngrok-urls.js

echo.
echo ✅ ¡Sistema iniciado completamente!
echo.
echo 📋 Servicios activos:
echo   🛒 Servidor de Pagos: http://localhost:3001
echo   🌐 Ngrok Interface: http://127.0.0.1:4040
echo.
echo 📝 Próximos pasos:
echo   1. Ve a http://127.0.0.1:4040 para ver la URL pública
echo   2. La configuración ya se actualizó automáticamente
echo   3. Prueba el pago con: node test-sandbox-payment.js
echo   4. Comparte la URL de pago con tus clientes
echo.
echo 🎯 Para crear un pago de prueba:
echo   node test-sandbox-payment.js
echo.
echo ⚠️  IMPORTANTE: Las URLs de ngrok cambian al reiniciar
echo.

REM Abrir ngrok interface
start http://127.0.0.1:4040

pause
