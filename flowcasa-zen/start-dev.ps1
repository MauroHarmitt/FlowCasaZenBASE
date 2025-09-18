Write-Host "🚀 Iniciando FlowCasaZen con MercadoPago..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 Iniciando servidor de MercadoPago en puerto 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mercadopago-solucion-main; npm start"

Write-Host "⏳ Esperando 3 segundos para que el servidor de MercadoPago inicie..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "🎨 Iniciando aplicación React en puerto 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host ""
Write-Host "✅ ¡Ambos servidores están iniciando!" -ForegroundColor Green
Write-Host "🌐 React App: http://localhost:3000" -ForegroundColor Blue
Write-Host "💳 MercadoPago Server: http://localhost:3001" -ForegroundColor Blue
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
