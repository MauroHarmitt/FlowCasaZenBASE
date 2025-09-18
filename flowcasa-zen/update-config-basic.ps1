# Script para actualizar configuracion con ngrok

param(
    [string]$NgrokUrl = "https://e046a6e7531e.ngrok-free.app"
)

Write-Host "Actualizando configuracion con URL: $NgrokUrl" -ForegroundColor Cyan

# URLs derivadas
$backendUrl = $NgrokUrl -replace "3000", "5000"
$webhookUrl = "$NgrokUrl/api/webhooks/mercadopago"
$successUrl = "$NgrokUrl/payment/success"
$failureUrl = "$NgrokUrl/payment/failure"
$pendingUrl = "$NgrokUrl/payment/pending"

Write-Host "Backend URL: $backendUrl" -ForegroundColor Green
Write-Host "Webhook URL: $webhookUrl" -ForegroundColor Green

# Actualizar frontend API
$frontendApi = "src\services\api.ts"
if (Test-Path $frontendApi) {
    Write-Host "Actualizando $frontendApi..." -ForegroundColor Yellow
    $content = Get-Content $frontendApi -Raw
    $oldPattern = "const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';"
    $newPattern = "const API_BASE_URL = process.env.REACT_APP_API_URL || '$backendUrl';"
    $content = $content.Replace($oldPattern, $newPattern)
    Set-Content $frontendApi $content -NoNewline
    Write-Host "Frontend API actualizado" -ForegroundColor Green
} else {
    Write-Host "Archivo no encontrado: $frontendApi" -ForegroundColor Yellow
}

# Actualizar configuracion de MercadoPago
$mercadopagoConfig = "mercadopago-solucion-main\config.js"
if (Test-Path $mercadopagoConfig) {
    Write-Host "Actualizando $mercadopagoConfig..." -ForegroundColor Yellow
    $content = Get-Content $mercadopagoConfig -Raw
    
    # Actualizar webhook URL
    $oldWebhook = "webhook: process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhooks/mercadopago'"
    $newWebhook = "webhook: process.env.WEBHOOK_URL || '$webhookUrl'"
    $content = $content.Replace($oldWebhook, $newWebhook)
    
    # Actualizar success URL
    $oldSuccess = "success: process.env.SUCCESS_URL || 'https://www.mercadopago.com.ar'"
    $newSuccess = "success: process.env.SUCCESS_URL || '$successUrl'"
    $content = $content.Replace($oldSuccess, $newSuccess)
    
    # Actualizar failure URL
    $oldFailure = "failure: process.env.FAILURE_URL || 'https://www.mercadopago.com.ar'"
    $newFailure = "failure: process.env.FAILURE_URL || '$failureUrl'"
    $content = $content.Replace($oldFailure, $newFailure)
    
    # Actualizar pending URL
    $oldPending = "pending: process.env.PENDING_URL || 'https://www.mercadopago.com.ar'"
    $newPending = "pending: process.env.PENDING_URL || '$pendingUrl'"
    $content = $content.Replace($oldPending, $newPending)
    
    Set-Content $mercadopagoConfig $content -NoNewline
    Write-Host "Configuracion de MercadoPago actualizada" -ForegroundColor Green
} else {
    Write-Host "Archivo no encontrado: $mercadopagoConfig" -ForegroundColor Yellow
}

# Crear/actualizar archivo .env
Write-Host "Creando/actualizando archivo .env..." -ForegroundColor Yellow

$envContent = @"
# CONFIGURACION DE FLOWCASA ZEN - ACTUALIZADA AUTOMATICAMENTE
# Generado el: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# URLs del Frontend y Backend
REACT_APP_API_URL=$backendUrl
REACT_APP_FRONTEND_URL=$NgrokUrl

# Configuracion de MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457
MERCADOPAGO_PUBLIC_KEY=APP_USR-f727d301-5562-4ef6-8866-96954070c812
MERCADOPAGO_SANDBOX=true

# URLs de Callback de MercadoPago
WEBHOOK_URL=$webhookUrl
SUCCESS_URL=$successUrl
FAILURE_URL=$failureUrl
PENDING_URL=$pendingUrl

# Configuracion de Base de Datos
MONGODB_URI=mongodb://localhost:27017/flowcasa-zen

# Configuracion de JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=7d

# Configuracion del Servidor
PORT=5000
HOST=localhost
NODE_ENV=development
"@

Set-Content ".env" $envContent -NoNewline
Write-Host "Archivo .env creado/actualizado" -ForegroundColor Green

Write-Host ""
Write-Host "Configuracion actualizada exitosamente!" -ForegroundColor BrightGreen
Write-Host ""
Write-Host "Resumen de cambios:" -ForegroundColor Cyan
Write-Host "   Frontend URL: $NgrokUrl" -ForegroundColor Green
Write-Host "   Backend URL: $backendUrl" -ForegroundColor Green
Write-Host "   Webhook URL: $webhookUrl" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   1. Reinicia el servidor backend para aplicar cambios de CORS" -ForegroundColor Yellow
Write-Host "   2. La URL cambiara cada vez que reinicies ngrok" -ForegroundColor Yellow
Write-Host "   3. Ejecuta este script cada vez que reinicies ngrok" -ForegroundColor Yellow
