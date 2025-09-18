@echo off
echo Iniciando servicios de FlowCasa Zen...
echo.

echo 1. Iniciando Backend API (puerto 5000)...
start "Backend API" cmd /k "cd server && npm start"
timeout /t 5 /nobreak >nul

echo 2. Iniciando Servidor MercadoPago (puerto 5001)...
start "MercadoPago" cmd /k "cd mercadopago-solucion-main && npm start"
timeout /t 5 /nobreak >nul

echo 3. Iniciando Frontend React (puerto 3000)...
start "Frontend React" cmd /k "npm start"
timeout /t 10 /nobreak >nul

echo.
echo Servicios iniciados!
echo.
echo Para verificar el estado:
echo   node verificar-puertos.js
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   Backend: http://localhost:5000
echo   MercadoPago: http://localhost:5001
echo   Ngrok: http://localhost:4040
echo.
pause
