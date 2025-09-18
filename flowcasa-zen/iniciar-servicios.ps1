# 🚀 SCRIPT PARA INICIAR SERVICIOS FLOWCASZEN
Write-Host "🚀 Iniciando servicios FlowCasaZen..." -ForegroundColor Green

# 1. Detener procesos existentes
Write-Host "🛑 Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Iniciar Backend
Write-Host "🔧 Iniciando Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm start" -WindowStyle Normal

# Esperar un momento
Start-Sleep -Seconds 5

# 3. Iniciar Frontend
Write-Host "🎨 Iniciando Frontend React..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start" -WindowStyle Normal

# 4. Esperar y verificar
Write-Host "⏳ Esperando que los servicios se inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 5. Verificar servicios
Write-Host "🔍 Verificando servicios..." -ForegroundColor Blue

try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5
    Write-Host "✅ Backend API: FUNCIONANDO" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API: NO RESPONDE" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ Frontend React: FUNCIONANDO" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend React: NO RESPONDE" -ForegroundColor Red
}

Write-Host "`n🎉 Script completado!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`n💡 Si algún servicio no responde, revisa las ventanas de PowerShell que se abrieron." -ForegroundColor Yellow