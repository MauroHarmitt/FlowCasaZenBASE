# 🔄 Script para actualizar configuración manualmente con la URL de ngrok

param(
    [string]$NgrokUrl = "https://e046a6e7531e.ngrok-free.app"
)

Write-Host "🔄 Actualizando configuración con URL: $NgrokUrl" -ForegroundColor Cyan

# 📁 Rutas de archivos
$frontendApi = "src\services\api.ts"
$mercadopagoConfig = "mercadopago-solucion-main\config.js"
$envFile = ".env"

# 🔧 URLs derivadas
$backendUrl = $NgrokUrl -replace "3000", "5000"
$webhookUrl = "$NgrokUrl/api/webhooks/mercadopago"
$successUrl = "$NgrokUrl/payment/success"
$failureUrl = "$NgrokUrl/payment/failure"
$pendingUrl = "$NgrokUrl/payment/pending"

Write-Host "🔧 Backend URL: $backendUrl" -ForegroundColor Green
Write-Host "💳 Webhook URL: $webhookUrl" -ForegroundColor Green

# 🔄 Actualizar frontend API
if (Test-Path $frontendApi) {
    Write-Host "🔄 Actualizando $frontendApi..." -ForegroundColor Yellow
    $content = Get-Content $frontendApi -Raw
    $content = $content -replace "const API_BASE_URL = process\.env\.REACT_APP_API_URL \|\| '[^']*';", "const API_BASE_URL = process.env.REACT_APP_API_URL || '$backendUrl';"
    Set-Content $frontendApi $content -NoNewline
    Write-Host "✅ Frontend API actualizado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo no encontrado: $frontendApi" -ForegroundColor Yellow
}

# 🔄 Actualizar configuración de MercadoPago
if (Test-Path $mercadopagoConfig) {
    Write-Host "🔄 Actualizando $mercadopagoConfig..." -ForegroundColor Yellow
    $content = Get-Content $mercadopagoConfig -Raw
    
    # Actualizar webhook URL
    $content = $content -replace "webhook: process\.env\.WEBHOOK_URL \|\| '[^']*'", "webhook: process.env.WEBHOOK_URL || '$webhookUrl'"
    
    # Actualizar success URL
    $content = $content -replace "success: process\.env\.SUCCESS_URL \|\| '[^']*'", "success: process.env.SUCCESS_URL || '$successUrl'"
    
    # Actualizar failure URL
    $content = $content -replace "failure: process\.env\.FAILURE_URL \|\| '[^']*'", "failure: process.env.FAILURE_URL || '$failureUrl'"
    
    # Actualizar pending URL
    $content = $content -replace "pending: process\.env\.PENDING_URL \|\| '[^']*'", "pending: process.env.PENDING_URL || '$pendingUrl'"
    
    Set-Content $mercadopagoConfig $content -NoNewline
    Write-Host "✅ Configuración de MercadoPago actualizada" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo no encontrado: $mercadopagoConfig" -ForegroundColor Yellow
}

# 🔄 Crear/actualizar archivo .env
Write-Host "🔄 Creando/actualizando archivo .env..." -ForegroundColor Yellow

$envContent = @"
# 🌐 CONFIGURACIÓN DE FLOWCASA ZEN - ACTUALIZADA AUTOMÁTICAMENTE
# Generado el: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# 🔧 URLs del Frontend y Backend
REACT_APP_API_URL=$backendUrl
REACT_APP_FRONTEND_URL=$NgrokUrl

# 💳 Configuración de MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457
MERCADOPAGO_PUBLIC_KEY=APP_USR-f727d301-5562-4ef6-8866-96954070c812
MERCADOPAGO_SANDBOX=true

# 🌐 URLs de Callback de MercadoPago
WEBHOOK_URL=$webhookUrl
SUCCESS_URL=$successUrl
FAILURE_URL=$failureUrl
PENDING_URL=$pendingUrl

# 🗄️ Configuración de Base de Datos
MONGODB_URI=mongodb://localhost:27017/flowcasa-zen

# 🔐 Configuración de JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=7d

# 🚀 Configuración del Servidor
PORT=5000
HOST=localhost
NODE_ENV=development
"@

Set-Content $envFile $envContent -NoNewline
Write-Host "✅ Archivo .env creado/actualizado" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 ¡Configuración actualizada exitosamente!" -ForegroundColor BrightGreen
Write-Host ""
Write-Host "📋 Resumen de cambios:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend URL: $NgrokUrl" -ForegroundColor Green
Write-Host "   🔧 Backend URL: $backendUrl" -ForegroundColor Green
Write-Host "   💳 Webhook URL: $webhookUrl" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   1. Reinicia el servidor backend para aplicar cambios de CORS" -ForegroundColor Yellow
Write-Host "   2. La URL cambiará cada vez que reinicies ngrok" -ForegroundColor Yellow
Write-Host "   3. Ejecuta este script cada vez que reinicies ngrok" -ForegroundColor Yellow
