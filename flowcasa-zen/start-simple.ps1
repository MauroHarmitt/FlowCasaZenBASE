# Start FlowCasaZen Services
Write-Host "Starting FlowCasaZen Services..." -ForegroundColor Green

# Stop existing processes
Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Start Backend
Write-Host "Starting Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm start"

# Wait
Start-Sleep -Seconds 5

# Start Frontend  
Write-Host "Starting Frontend React..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

Write-Host "Services started! Check the new PowerShell windows." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
