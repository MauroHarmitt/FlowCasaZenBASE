# 🌐 GUÍA COMPLETA: GODADDY → CLOUDFLARE → NGINX → UBUNTU

## 📋 Arquitectura del Sistema
```
Usuario → GoDaddy DNS → Cloudflare → Tu Servidor Ubuntu (Nginx) → FlowCasa Zen
```

## 🚀 PASO 1: CREAR CUENTA EN CLOUDFLARE

### 1.1 Registro en Cloudflare
1. Ve a [cloudflare.com](https://cloudflare.com)
2. Haz clic en "Sign Up" (Registro gratuito)
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre de usuario

### 1.2 Verificar Email
- Revisa tu bandeja de entrada
- Haz clic en el enlace de verificación

## 🔗 PASO 2: CONECTAR GODADDY A CLOUDFLARE

### 2.1 Agregar Dominio a Cloudflare
1. En el dashboard de Cloudflare, haz clic en "Add a Site"
2. Ingresa: `flowcasazen.com`
3. Selecciona el plan **FREE** (suficiente para empezar)
4. Haz clic en "Continue"

### 2.2 Cloudflare Escaneará tu DNS
- Cloudflare detectará automáticamente los registros DNS actuales
- Revisa que aparezcan correctamente:
  ```
  Type: A
  Name: @
  Content: (tu IP actual o la que tendrás)
  
  Type: A  
  Name: www
  Content: (tu IP actual o la que tendrás)
  ```

### 2.3 Cambiar Nameservers en GoDaddy

#### En GoDaddy:
1. Inicia sesión en tu cuenta de GoDaddy
2. Ve a "Mis Productos" → "Dominios"
3. Busca `flowcasazen.com` y haz clic en "DNS"
4. Anota los **nameservers actuales** (por si necesitas volver atrás)

#### En Cloudflare:
1. Cloudflare te dará **2 nameservers** como estos:
   ```
   dante.ns.cloudflare.com
   nina.ns.cloudflare.com
   ```

#### De vuelta en GoDaddy:
1. Ve a "Nameservers" → "Change"
2. Selecciona "Custom"
3. Ingresa los 2 nameservers de Cloudflare
4. Haz clic en "Save"

### 2.4 Verificar Propagación DNS
```bash
# Verificar que los nameservers se propagaron (puede tardar hasta 48 horas)
nslookup -type=NS flowcasazen.com

# Deberías ver algo como:
# flowcasazen.com nameserver = dante.ns.cloudflare.com
# flowcasazen.com nameserver = nina.ns.cloudflare.com
```

## 🖥️ PASO 3: CONFIGURAR SERVIDOR UBUNTU

### 3.1 Preparar Servidor Ubuntu
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Nginx
sudo apt install nginx -y

# Instalar PM2
sudo npm install -g pm2

# Instalar Certbot (para SSL local)
sudo apt install certbot python3-certbot-nginx -y
```

### 3.2 Configurar Firewall
```bash
# Configurar UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Verificar estado
sudo ufw status
```

## ⚙️ PASO 4: CONFIGURAR NGINX PARA CLOUDFLARE

### 4.1 Crear Configuración de Nginx
Crear archivo `/etc/nginx/sites-available/flowcasazen.com`:

```nginx
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

    # SSL Configuration (certificado local)
    ssl_certificate /etc/letsencrypt/live/flowcasazen.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flowcasazen.com/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Solo permitir tráfico de Cloudflare (mismo bloque que arriba)
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
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

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
        
        # No cache para webhooks
        proxy_cache off;
    }

    # Logs
    access_log /var/log/nginx/flowcasazen_access.log;
    error_log /var/log/nginx/flowcasazen_error.log;
}
```

### 4.2 Activar el Sitio
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/flowcasazen.com /etc/nginx/sites-enabled/

# Eliminar sitio por defecto
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

## 🔒 PASO 5: CONFIGURAR SSL CON CLOUDFLARE

### 5.1 SSL en Cloudflare (Automático)
1. En Cloudflare, ve a "SSL/TLS" → "Overview"
2. Selecciona **"Full (strict)"** mode
3. Esto habilitará SSL automáticamente

### 5.2 SSL Local con Let's Encrypt
```bash
# Obtener certificado SSL local
sudo certbot --nginx -d flowcasazen.com -d www.flowcasazen.com

# Configurar auto-renovación
sudo crontab -e
# Agregar esta línea:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 PASO 6: CONFIGURAR REGISTROS DNS EN CLOUDFLARE

### 6.1 Registros DNS Básicos
En Cloudflare, ve a "DNS" → "Records" y configura:

```
Type: A
Name: @
Content: [IP_DE_TU_SERVIDOR_UBUNTU]
Proxy status: Proxied (nube naranja)
TTL: Auto

Type: A
Name: www  
Content: [IP_DE_TU_SERVIDOR_UBUNTU]
Proxy status: Proxied (nube naranja)
TTL: Auto
```

### 6.2 Configuraciones Adicionales en Cloudflare

#### Speed (Velocidad):
- **Auto Minify**: Habilitar para CSS, HTML, JS
- **Brotli**: Habilitado
- **HTTP/2**: Habilitado
- **HTTP/3 (QUIC)**: Habilitado

#### Caching:
- **Caching Level**: Standard
- **Browser Cache TTL**: 4 hours
- **Always Online**: Habilitado

#### Security (Seguridad):
- **Security Level**: Medium
- **Bot Fight Mode**: Habilitado
- **Challenge Passage**: 30 minutes

## 🚀 PASO 7: DESPLEGAR FLOWCASA ZEN

### 7.1 Subir Aplicación al Servidor
```bash
# En tu servidor Ubuntu
cd /var/www
sudo mkdir flowcasazen
sudo chown $USER:$USER flowcasazen
cd flowcasazen

# Clonar tu repositorio o subir archivos
git clone tu-repositorio .
# O subir archivos via SCP/SFTP
```

### 7.2 Instalar y Configurar
```bash
# Instalar dependencias
npm run install:all

# Configurar para producción
npm run setup:production

# Crear build
npm run build

# Mover archivos a la ubicación correcta
sudo cp -r build/* /var/www/flowcasazen/build/
sudo chown -R www-data:www-data /var/www/flowcasazen/
```

### 7.3 Configurar PM2 para el Backend
```bash
# Crear ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
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
      PORT: 5000
    }
  }]
};
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 PASO 8: CONFIGURACIONES AVANZADAS

### 8.1 Page Rules en Cloudflare
Crear reglas para optimizar:

1. **Cache Everything** para archivos estáticos:
   - URL: `flowcasazen.com/static/*`
   - Setting: Cache Level = Cache Everything
   - Edge Cache TTL = 1 month

2. **Bypass Cache** para API:
   - URL: `flowcasazen.com/api/*`
   - Setting: Cache Level = Bypass

### 8.2 Configuración de Firewall en Cloudflare
1. Ve a "Security" → "WAF"
2. Habilitar "Managed Ruleset"
3. Configurar "Rate Limiting":
   - 100 requests por minuto por IP
   - 10 requests por minuto para `/api/*`

## 📊 MONITOREO Y MANTENIMIENTO

### 8.1 Logs
```bash
# Logs de Nginx
sudo tail -f /var/log/nginx/flowcasazen_access.log
sudo tail -f /var/log/nginx/flowcasazen_error.log

# Logs de PM2
pm2 logs flowcasa-zen-api

# Logs de Cloudflare
# Ve a Analytics & Logs en el dashboard de Cloudflare
```

### 8.2 Monitoreo
- **Cloudflare Analytics**: Tráfico, velocidad, seguridad
- **Server Resources**: `htop`, `df -h`
- **PM2 Status**: `pm2 status`

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema: 502 Bad Gateway
```bash
# Verificar que PM2 esté corriendo
pm2 status

# Verificar que el puerto 5000 esté abierto
sudo netstat -tlnp | grep 5000

# Revisar logs
pm2 logs flowcasa-zen-api
sudo tail /var/log/nginx/error.log
```

### Problema: SSL no funciona
```bash
# Verificar certificados
sudo certbot certificates

# Verificar configuración Nginx
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### Problema: DNS no resuelve
```bash
# Verificar propagación DNS
dig flowcasazen.com
nslookup flowcasazen.com

# Verificar nameservers
dig NS flowcasazen.com
```

## ✅ CHECKLIST FINAL

- [ ] Cuenta Cloudflare creada
- [ ] Dominio agregado a Cloudflare
- [ ] Nameservers cambiados en GoDaddy
- [ ] Servidor Ubuntu configurado
- [ ] Nginx instalado y configurado
- [ ] SSL configurado (Cloudflare + Let's Encrypt)
- [ ] DNS configurado en Cloudflare
- [ ] FlowCasa Zen desplegado
- [ ] PM2 configurado
- [ ] Firewall configurado
- [ ] Monitoreo activado

---

**🎉 ¡Tu aplicación FlowCasa Zen estará disponible en https://www.flowcasazen.com con máxima seguridad y rendimiento!**
