# Script completo para configurar ngrok y actualizar configuracion

Write-Host "=== CONFIGURADOR DE NGROK PARA FLOWCASA ZEN ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si ngrok esta corriendo
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method Get
    $tunnels = $response.tunnels
    
    if ($tunnels -and $tunnels.Count -gt 0) {
        $httpTunnel = $tunnels | Where-Object { $_.config.addr -eq "http://localhost:3000" -and $_.proto -eq "https" }
        
        if ($httpTunnel) {
            $ngrokUrl = $httpTunnel.public_url
            Write-Host "ngrok encontrado corriendo en: $ngrokUrl" -ForegroundColor Green
            Write-Host ""
            
            # Actualizar configuracion
            Write-Host "Actualizando configuracion..." -ForegroundColor Yellow
            
            # URLs derivadas
            $backendUrl = $ngrokUrl -replace "3000", "5000"
            $webhookUrl = "$ngrokUrl/api/webhooks/mercadopago"
            $successUrl = "$ngrokUrl/payment/success"
            $failureUrl = "$ngrokUrl/payment/failure"
            $pendingUrl = "$ngrokUrl/payment/pending"
            
            # Actualizar frontend API
            $frontendApi = "src\services\api.ts"
            if (Test-Path $frontendApi) {
                $content = Get-Content $frontendApi -Raw
                $oldPattern = "const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';"
                $newPattern = "const API_BASE_URL = process.env.REACT_APP_API_URL || '$backendUrl';"
                $content = $content.Replace($oldPattern, $newPattern)
                Set-Content $frontendApi $content -NoNewline
                Write-Host "Frontend API actualizado" -ForegroundColor Green
            }
            
            # Actualizar configuracion de MercadoPago
            $mercadopagoConfig = "mercadopago-solucion-main\config.js"
            if (Test-Path $mercadopagoConfig) {
                $content = Get-Content $mercadopagoConfig -Raw
                
                $oldWebhook = "webhook: process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhooks/mercadopago'"
                $newWebhook = "webhook: process.env.WEBHOOK_URL || '$webhookUrl'"
                $content = $content.Replace($oldWebhook, $newWebhook)
                
                $oldSuccess = "success: process.env.SUCCESS_URL || 'https://www.mercadopago.com.ar'"
                $newSuccess = "success: process.env.SUCCESS_URL || '$successUrl'"
                $content = $content.Replace($oldSuccess, $newSuccess)
                
                $oldFailure = "failure: process.env.FAILURE_URL || 'https://www.mercadopago.com.ar'"
                $newFailure = "failure: process.env.FAILURE_URL || '$failureUrl'"
                $content = $content.Replace($oldFailure, $newFailure)
                
                $oldPending = "pending: process.env.PENDING_URL || 'https://www.mercadopago.com.ar'"
                $newPending = "pending: process.env.PENDING_URL || '$pendingUrl'"
                $content = $content.Replace($oldPending, $newPending)
                
                Set-Content $mercadopagoConfig $content -NoNewline
                Write-Host "Configuracion de MercadoPago actualizada" -ForegroundColor Green
            }
            
            # Crear archivo .env
            $envContent = @"
# CONFIGURACION DE FLOWCASA ZEN - ACTUALIZADA AUTOMATICAMENTE
# Generado el: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# URLs del Frontend y Backend
REACT_APP_API_URL=$backendUrl
REACT_APP_FRONTEND_URL=$ngrokUrl

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
            Write-Host "=== CONFIGURACION COMPLETADA ===" -ForegroundColor Green
            Write-Host ""
            Write-Host "URLs configuradas:" -ForegroundColor Cyan
            Write-Host "  Frontend: $ngrokUrl" -ForegroundColor White
            Write-Host "  Backend:  $backendUrl" -ForegroundColor White
            Write-Host "  Webhook:  $webhookUrl" -ForegroundColor White
            Write-Host ""
            Write-Host "Interfaz web de ngrok: http://localhost:4040" -ForegroundColor Blue
            Write-Host ""
            Write-Host "IMPORTANTE:" -ForegroundColor Yellow
            Write-Host "  1. Reinicia el servidor backend para aplicar cambios de CORS" -ForegroundColor Yellow
            Write-Host "  2. La URL cambiara cada vez que reinicies ngrok" -ForegroundColor Yellow
            Write-Host "  3. Ejecuta este script cada vez que reinicies ngrok" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Tu web esta lista para compartir y hacer pruebas de MercadoPago!" -ForegroundColor Green
            
        } else {
            Write-Host "No se encontro tunel HTTP para puerto 3000" -ForegroundColor Red
            Write-Host "Asegurate de que ngrok este corriendo con: ngrok http 3000" -ForegroundColor Yellow
        }
    } else {
        Write-Host "No se encontraron tuneles activos de ngrok" -ForegroundColor Red
        Write-Host "Inicia ngrok con: ngrok http 3000" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error: ngrok no esta corriendo o no esta disponible" -ForegroundColor Red
    Write-Host "Inicia ngrok con: ngrok http 3000" -ForegroundColor Yellow
    Write-Host "Error detallado: $($_.Exception.Message)" -ForegroundColor Red
}
