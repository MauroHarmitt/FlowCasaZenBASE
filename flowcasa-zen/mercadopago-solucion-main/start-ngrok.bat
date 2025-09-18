@echo off
echo 🚀 INICIANDO FLOWCASZEN CON NGROK
echo =====================================
echo.

echo 📋 Verificando que ngrok esté instalado...
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ngrok no está instalado o no está en el PATH
    echo 📥 Descarga ngrok desde: https://ngrok.com/download
    echo 🔧 O instala con: npm install -g ngrok
    pause
    exit /b 1
)

echo ✅ ngrok encontrado
echo.

echo 🔧 Iniciando servidor de pagos en puerto 3001...
start "Servidor Pagos" cmd /k "node server.js"

echo ⏳ Esperando 3 segundos para que el servidor inicie...
timeout /t 3 /nobreak >nul

echo 🌐 Iniciando ngrok para el servidor de pagos (puerto 3001)...
start "Ngrok Pagos" cmd /k "ngrok http 3001"

echo.
echo ✅ ¡Servicios iniciados!
echo.
echo 📋 URLs disponibles:
echo   🔗 Ngrok Interface: http://127.0.0.1:4040
echo   🛒 Servidor Pagos: http://localhost:3001
echo.
echo 📝 Próximos pasos:
echo   1. Ve a http://127.0.0.1:4040 para ver la URL pública
echo   2. Copia la URL HTTPS (ej: https://abc123.ngrok-free.app)
echo   3. Actualiza la configuración con esa URL
echo   4. Prueba el pago con: node test-sandbox-payment.js
echo.
echo ⚠️  IMPORTANTE: Las URLs de ngrok cambian al reiniciar
echo.
pause
