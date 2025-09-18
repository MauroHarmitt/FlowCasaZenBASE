#!/bin/bash

# 🚀 SCRIPT DE CONFIGURACIÓN UBUNTU SERVER PARA FLOWCASA ZEN
# Configuración completa: Ubuntu + Nginx + Cloudflare + SSL

set -e

echo "🌐 CONFIGURANDO UBUNTU SERVER PARA FLOWCASA ZEN"
echo "================================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar si se ejecuta como root
if [[ $EUID -eq 0 ]]; then
   print_error "Este script no debe ejecutarse como root. Usa un usuario con sudo."
   exit 1
fi

# Verificar que existe sudo
if ! command -v sudo &> /dev/null; then
    print_error "sudo no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "🔄 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y
print_status "Sistema actualizado"

echo ""
echo "📦 Instalando dependencias básicas..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
print_status "Dependencias básicas instaladas"

echo ""
echo "🟢 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
print_status "Node.js $(node --version) instalado"
print_status "npm $(npm --version) instalado"

echo ""
echo "🌐 Instalando Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
print_status "Nginx instalado y configurado"

echo ""
echo "📦 Instalando PM2..."
sudo npm install -g pm2
print_status "PM2 instalado"

echo ""
echo "🔒 Instalando Certbot para SSL..."
sudo apt install -y certbot python3-certbot-nginx
print_status "Certbot instalado"

echo ""
echo "🔥 Configurando Firewall (UFW)..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
print_status "Firewall configurado"

echo ""
echo "📁 Creando estructura de directorios..."
sudo mkdir -p /var/www/flowcasazen
sudo chown $USER:$USER /var/www/flowcasazen
print_status "Directorio /var/www/flowcasazen creado"

echo ""
echo "⚙️ Configurando Nginx para Cloudflare..."

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/flowcasazen.com > /dev/null << 'EOF'
# Configuración para FlowCasa Zen con Cloudflare
server {
    listen 80;
    server_name flowcasazen.com www.flowcasazen.com;
    
    # Solo permitir tráfico de Cloudflare (seguridad)
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    real_ip_header CF-Connecting-IP;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name flowcasazen.com www.flowcasazen.com;

    # SSL Configuration (se configurará después con Certbot)
    ssl_certificate /etc/letsencrypt/live/flowcasazen.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flowcasazen.com/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Solo permitir tráfico de Cloudflare
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    real_ip_header CF-Connecting-IP;

    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Frontend React (archivos estáticos)
    location / {
        root /var/www/flowcasazen/build;
        try_files $uri $uri/ /index.html;
        
        # Cache para archivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Webhooks de MercadoPago
    location /api/webhooks {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache off;
    }

    # Logs
    access_log /var/log/nginx/flowcasazen_access.log;
    error_log /var/log/nginx/flowcasazen_error.log;
}
EOF

# Activar el sitio
sudo ln -sf /etc/nginx/sites-available/flowcasazen.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t
sudo systemctl reload nginx
print_status "Nginx configurado para Cloudflare"

echo ""
echo "📝 Creando archivo de configuración PM2..."

# Crear ecosystem.config.js
cat > /var/www/flowcasazen/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'flowcasa-zen-api',
    script: 'server/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Crear directorio de logs
mkdir -p /var/www/flowcasazen/logs
print_status "Configuración PM2 creada"

echo ""
echo "🔧 Configurando auto-renovación SSL..."
# Configurar crontab para renovación automática
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
print_status "Auto-renovación SSL configurada"

echo ""
echo "📊 Configurando monitoreo básico..."

# Crear script de monitoreo
cat > /var/www/flowcasazen/monitor.sh << 'EOF'
#!/bin/bash
# Script de monitoreo básico para FlowCasa Zen

echo "=== FLOWCASA ZEN MONITORING ==="
echo "Fecha: $(date)"
echo ""

echo "🖥️  Estado del Sistema:"
echo "Uptime: $(uptime)"
echo "Memoria: $(free -h | grep '^Mem' | awk '{print $3 "/" $2}')"
echo "Disco: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 " usado)"}')"
echo ""

echo "🌐 Estado de Nginx:"
sudo systemctl is-active nginx && echo "✅ Nginx activo" || echo "❌ Nginx inactivo"
echo ""

echo "🚀 Estado de PM2:"
pm2 status
echo ""

echo "🔗 Conexiones de red:"
sudo netstat -tlnp | grep -E ':(80|443|5000)'
echo ""

echo "📝 Últimos logs de error:"
sudo tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No hay logs de error"
EOF

chmod +x /var/www/flowcasazen/monitor.sh
print_status "Script de monitoreo creado"

echo ""
echo "🎯 MOSTRANDO INFORMACIÓN DEL SERVIDOR..."
echo "========================================"
echo ""
print_info "IP del servidor: $(curl -s ifconfig.me)"
print_info "Hostname: $(hostname)"
print_info "Ubicación de la aplicación: /var/www/flowcasazen"
print_info "Configuración Nginx: /etc/nginx/sites-available/flowcasazen.com"
print_info "Logs Nginx: /var/log/nginx/"
print_info ""

echo "✅ CONFIGURACIÓN DEL SERVIDOR COMPLETADA"
echo "========================================"
echo ""
print_warning "PRÓXIMOS PASOS:"
echo ""
echo "1. 🌐 CONFIGURAR CLOUDFLARE:"
echo "   - Crea cuenta en cloudflare.com"
echo "   - Agrega el dominio flowcasazen.com"
echo "   - Cambia los nameservers en GoDaddy"
echo ""
echo "2. 📁 SUBIR APLICACIÓN:"
echo "   - Clona tu repositorio en /var/www/flowcasazen"
echo "   - Ejecuta: npm run install:all"
echo "   - Ejecuta: npm run setup:production"
echo "   - Ejecuta: npm run build"
echo "   - Copia build/ a /var/www/flowcasazen/build/"
echo ""
echo "3. 🚀 INICIAR APLICACIÓN:"
echo "   cd /var/www/flowcasazen"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "4. 🔒 CONFIGURAR SSL:"
echo "   sudo certbot --nginx -d flowcasazen.com -d www.flowcasazen.com"
echo ""
echo "5. 📊 MONITOREAR:"
echo "   /var/www/flowcasazen/monitor.sh"
echo ""
print_info "IP del servidor para configurar en Cloudflare: $(curl -s ifconfig.me)"
echo ""
echo "🎉 ¡Servidor Ubuntu listo para FlowCasa Zen!"
