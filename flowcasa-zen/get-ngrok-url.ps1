# 🔍 Script simple para obtener la URL de ngrok
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method Get
    $tunnels = $response.tunnels
    
    if ($tunnels -and $tunnels.Count -gt 0) {
        $httpTunnel = $tunnels | Where-Object { $_.config.addr -eq "http://localhost:3000" -and $_.proto -eq "https" }
        
        if ($httpTunnel) {
            Write-Host "URL de ngrok: $($httpTunnel.public_url)"
            return $httpTunnel.public_url
        } else {
            Write-Host "No se encontró túnel HTTP para puerto 3000"
            return $null
        }
    } else {
        Write-Host "No se encontraron túneles activos"
        return $null
    }
} catch {
    Write-Host "Error obteniendo URL de ngrok: $($_.Exception.Message)"
    return $null
}
