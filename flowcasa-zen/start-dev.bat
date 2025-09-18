@echo off
echo 🚀 Iniciando FlowCasaZen con MercadoPago...
echo.

echo 📦 Iniciando servidor de MercadoPago en puerto 3001...
start "MercadoPago Server" cmd /k "cd mercadopago-solucion-main && npm start"

echo ⏳ Esperando 3 segundos para que el servidor de MercadoPago inicie...
timeout /t 3 /nobreak > nul

echo 🎨 Iniciando aplicación React en puerto 3000...
start "React App" cmd /k "npm start"

echo.
echo ✅ ¡Ambos servidores están iniciando!
echo 🌐 React App: http://localhost:3000
echo 💳 MercadoPago Server: http://localhost:3001
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
