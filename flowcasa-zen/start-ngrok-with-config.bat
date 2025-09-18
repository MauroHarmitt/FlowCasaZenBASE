@echo off
REM 🚀 SCRIPT DE NGROK CON CONFIGURACIÓN AUTOMÁTICA
REM Este script inicia ngrok y actualiza automáticamente la configuración del frontend y backend

setlocal enabledelayedexpansion

REM 🎨 Configuración de colores
color 0A

echo.
echo 🚀 Iniciando ngrok con configuración automática...
echo.

REM 🔍 Verificar si ngrok está instalado
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: ngrok no está instalado
    echo    Instala ngrok desde: https://ngrok.com/download
    pause
    exit /b 1
)

echo ✅ ngrok encontrado
echo.

REM 🔍 Verificar si el puerto está en uso
netstat -an | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ✅ Puerto 3000 está en uso (aplicación corriendo)
) else (
    echo ⚠️  Puerto 3000 no está en uso. Asegúrate de que la aplicación esté corriendo
)
echo.

REM 🚀 Iniciar ngrok en segundo plano
echo 🚀 Iniciando ngrok en puerto 3000...
start /b ngrok http 3000 --region sa

REM ⏳ Esperar a que ngrok se inicie
echo ⏳ Esperando a que ngrok se inicie...
timeout /t 5 /nobreak >nul

REM 🔍 Verificar que ngrok esté corriendo
curl -s http://localhost:4040/api/tunnels >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: ngrok no se inició correctamente
    echo    Verifica que el puerto 4040 esté disponible
    pause
    exit /b 1
)

echo ✅ ngrok iniciado correctamente
echo.

REM 🔄 Actualizar configuración automáticamente
echo 🔄 Actualizando configuración automáticamente...
node update-ngrok-config.js
if %errorlevel% equ 0 (
    echo ✅ Configuración actualizada exitosamente
) else (
    echo ⚠️  Hubo problemas actualizando la configuración
)
echo.

REM 📋 Mostrar información del túnel
echo 📋 Obteniendo información del túnel...
for /f "tokens=*" %%i in ('curl -s http://localhost:4040/api/tunnels ^| findstr "public_url"') do (
    set "tunnel_info=%%i"
)

if defined tunnel_info (
    echo 🎉 ¡ngrok configurado exitosamente!
    echo.
    echo 📋 Información del túnel:
    echo    🌐 URL Pública: !tunnel_info!
    echo    🔧 URL Backend: !tunnel_info:3000=5000!
    echo    💳 Webhook URL: !tunnel_info!/api/webhooks/mercadopago
    echo.
    echo 🌐 Interfaz web de ngrok: http://localhost:4040
    echo.
    echo ⚠️  IMPORTANTE:
    echo    1. Reinicia el servidor backend para aplicar cambios de CORS
    echo    2. La URL cambiará cada vez que reinicies ngrok
    echo    3. Ejecuta este script cada vez que reinicies ngrok
    echo.
    echo 🛑 Para detener ngrok, presiona Ctrl+C
) else (
    echo ⚠️  No se pudo obtener información del túnel
)

echo.
echo 🎯 Manteniendo ngrok corriendo...
echo    Presiona Ctrl+C para detener

REM 🎯 Mantener el script corriendo
:loop
timeout /t 10 /nobreak >nul
goto loop
