# 🚀 SCRIPT PARA INICIAR FLOWCASZEN CON NGROK
# PowerShell script para Windows

Write-Host "🚀 INICIANDO FLOWCASZEN CON NGROK" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Verificar que ngrok esté instalado
Write-Host "📋 Verificando que ngrok esté instalado..." -ForegroundColor Yellow
try {
    $ngrokVersion = ngrok version 2>$null
    Write-Host "✅ ngrok encontrado: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ngrok no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "📥 Descarga ngrok desde: https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "🔧 O instala con: npm install -g ngrok" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# Iniciar servidor de pagos
Write-Host "🔧 Iniciando servidor de pagos en puerto 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server.js" -WindowStyle Normal

# Esperar un momento
Write-Host "⏳ Esperando 3 segundos para que el servidor inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Iniciar ngrok
Write-Host "🌐 Iniciando ngrok para el servidor de pagos (puerto 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 3001" -WindowStyle Normal

Write-Host ""
Write-Host "✅ ¡Servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 URLs disponibles:" -ForegroundColor Cyan
Write-Host "  🔗 Ngrok Interface: http://127.0.0.1:4040" -ForegroundColor White
Write-Host "  🛒 Servidor Pagos: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Ve a http://127.0.0.1:4040 para ver la URL pública" -ForegroundColor White
Write-Host "  2. Copia la URL HTTPS (ej: https://abc123.ngrok-free.app)" -ForegroundColor White
Write-Host "  3. Actualiza la configuración con esa URL" -ForegroundColor White
Write-Host "  4. Prueba el pago con: node test-sandbox-payment.js" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Las URLs de ngrok cambian al reiniciar" -ForegroundColor Yellow
Write-Host ""

# Abrir ngrok interface automáticamente
Write-Host "🌐 Abriendo interfaz de ngrok..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:4040"

Read-Host "Presiona Enter para continuar"
