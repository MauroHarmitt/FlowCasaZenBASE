# 🚀 SCRIPT COMPLETO PARA INICIAR FLOWCASZEN CON NGROK
# PowerShell script para Windows

Write-Host "🚀 INICIANDO SISTEMA COMPLETO FLOWCASZEN" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Verificar dependencias
Write-Host "📋 Verificando dependencias..." -ForegroundColor Yellow

# Verificar Node.js
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar ngrok
try {
    $ngrokVersion = ngrok version 2>$null
    Write-Host "✅ ngrok encontrado: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ngrok no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga ngrok desde: https://ngrok.com/download" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# Iniciar servidor de pagos
Write-Host "🔧 Iniciando servidor de pagos en puerto 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🛒 Servidor de Pagos FlowCasaZen' -ForegroundColor Green; cd '$PWD'; node server.js" -WindowStyle Normal

# Esperar que el servidor inicie
Write-Host "⏳ Esperando 5 segundos para que el servidor inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar ngrok
Write-Host "🌐 Iniciando ngrok para el servidor de pagos..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🌐 Ngrok para Servidor de Pagos' -ForegroundColor Green; ngrok http 3001" -WindowStyle Normal

# Esperar que ngrok inicie
Write-Host "⏳ Esperando 3 segundos para que ngrok inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Actualizar configuración
Write-Host "🔄 Actualizando configuración con URLs de ngrok..." -ForegroundColor Yellow
try {
    node update-ngrok-urls.js
} catch {
    Write-Host "⚠️  No se pudo actualizar automáticamente, actualiza manualmente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ ¡Sistema iniciado completamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Servicios activos:" -ForegroundColor Cyan
Write-Host "  🛒 Servidor de Pagos: http://localhost:3001" -ForegroundColor White
Write-Host "  🌐 Ngrok Interface: http://127.0.0.1:4040" -ForegroundColor White
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Ve a http://127.0.0.1:4040 para ver la URL pública" -ForegroundColor White
Write-Host "  2. La configuración ya se actualizó automáticamente" -ForegroundColor White
Write-Host "  3. Prueba el pago con: node test-sandbox-payment.js" -ForegroundColor White
Write-Host "  4. Comparte la URL de pago con tus clientes" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Para crear un pago de prueba:" -ForegroundColor Cyan
Write-Host "  node test-sandbox-payment.js" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Las URLs de ngrok cambian al reiniciar" -ForegroundColor Yellow
Write-Host ""

# Abrir ngrok interface
Write-Host "🌐 Abriendo interfaz de ngrok..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:4040"

Read-Host "Presiona Enter para continuar"
