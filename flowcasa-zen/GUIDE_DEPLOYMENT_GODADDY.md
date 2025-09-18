# 🚀 GUÍA DE DESPLIEGUE - FLOWCASA ZEN EN GODADDY

## 📋 Resumen
Esta guía te ayudará a desplegar tu aplicación FlowCasa Zen en el dominio `www.flowcasazen.com` usando GoDaddy.

## 🔧 Configuración Previa

### 1. Variables de Entorno Importantes
Antes de desplegar, actualiza estas variables en `env.production`:

```bash
# Base de datos - OBLIGATORIO cambiar
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/flowcasa-zen

# JWT Secret - OBLIGATORIO cambiar por uno seguro
JWT_SECRET=tu_jwt_secret_muy_seguro_para_produccion_aqui_cambiar_por_uno_real

# MercadoPago - Verificar credenciales de producción
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_produccion
MERCADOPAGO_PUBLIC_KEY=tu_public_key_de_produccion
MERCADOPAGO_SANDBOX=false
```

## 🌐 Opciones de Hosting en GoDaddy

### Opción 1: Hosting Compartido (Económico)
**Para aplicaciones React estáticas**

1. **Configurar el build**:
   ```bash
   npm run build:production
   ```

2. **Subir archivos**:
   - Sube todo el contenido de la carpeta `build/` a la carpeta `public_html` de tu hosting
   - Asegúrate de que `index.html` esté en la raíz

3. **Configurar el servidor backend**:
   - Necesitarás un hosting con Node.js (GoDaddy Deluxe o Ultimate)
   - O usar un servicio externo como Heroku, Vercel, o Railway para el backend

### Opción 2: VPS/Servidor Dedicado (Recomendado)
**Para aplicaciones full-stack**

1. **Contratar VPS**:
   - GoDaddy VPS o servidor dedicado
   - Mínimo: 2GB RAM, 1 CPU, 20GB SSD

2. **Configurar el servidor**:
   ```bash
   # Instalar Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Instalar PM2 para gestión de procesos
   sudo npm install -g pm2

   # Instalar Nginx como proxy reverso
   sudo apt update
   sudo apt install nginx
   ```

## 🔧 Configuración del Servidor

### 1. Instalar Dependencias
```bash
# En tu servidor VPS
git clone tu-repositorio
cd flowcasa-zen
npm run install:all
```

### 2. Configurar Variables de Entorno
```bash
# Copiar configuración de producción
cp env.production .env
cp env.production server/.env

# Editar las variables necesarias
nano .env
nano server/.env
```

### 3. Configurar Nginx
Crear archivo `/etc/nginx/sites-available/flowcasazen.com`:

```nginx
server {
    listen 80;
    server_name www.flowcasazen.com flowcasazen.com;

    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.flowcasazen.com flowcasazen.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend (React)
    location / {
        root /path/to/your/build;
        try_files $uri $uri/ /index.html;
        
        # Headers de seguridad
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
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
    }

    # Webhooks de MercadoPago
    location /api/webhooks {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Activar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/flowcasazen.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Configuración SSL

### Opción 1: Certificado Gratuito con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d flowcasazen.com -d www.flowcasazen.com

# Auto-renovación
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Opción 2: Certificado de GoDaddy
- Comprar SSL en GoDaddy
- Subir certificados al servidor
- Configurar en Nginx

## 🚀 Despliegue con PM2

### 1. Crear archivo de configuración PM2
Crear `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'flowcasa-zen-api',
      script: 'server/server.js',
      cwd: '/path/to/your/app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

### 2. Iniciar la aplicación
```bash
# Build de producción
npm run deploy:build

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Configuración DNS en GoDaddy

### 1. Acceder al Panel de Control
- Inicia sesión en GoDaddy
- Ve a "Mis Productos" > "DNS"

### 2. Configurar Registros DNS
```
Tipo: A
Nombre: @
Valor: IP_DE_TU_SERVIDOR
TTL: 600

Tipo: A  
Nombre: www
Valor: IP_DE_TU_SERVIDOR
TTL: 600
```

### 3. Verificar Configuración
```bash
# Verificar DNS
nslookup flowcasazen.com
nslookup www.flowcasazen.com
```

## 📊 Monitoreo y Mantenimiento

### 1. Logs
```bash
# Ver logs de PM2
pm2 logs

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Monitoreo de recursos
```bash
# Estado de PM2
pm2 status

# Recursos del sistema
htop
df -h
```

### 3. Backup
```bash
# Backup de la base de datos
mongodump --uri="tu_mongodb_uri" --out=backup_$(date +%Y%m%d)

# Backup del código
tar -czf flowcasa-zen-backup-$(date +%Y%m%d).tar.gz /path/to/your/app
```

## 🔧 Comandos Útiles

### Desarrollo Local
```bash
npm run dev                    # Desarrollo completo
npm run build:production       # Build para producción
npm run setup:production       # Configurar entorno
```

### Producción
```bash
pm2 restart flowcasa-zen-api   # Reiniciar API
pm2 reload flowcasa-zen-api    # Recargar sin downtime
sudo systemctl reload nginx    # Recargar Nginx
```

## 🚨 Solución de Problemas

### Error de CORS
- Verificar que el dominio esté en la configuración CORS del servidor
- Comprobar que las URLs en `.env` sean correctas

### Error 502 Bad Gateway
- Verificar que PM2 esté ejecutándose: `pm2 status`
- Comprobar logs: `pm2 logs flowcasa-zen-api`

### SSL no funciona
- Verificar certificados: `sudo nginx -t`
- Comprobar que el puerto 443 esté abierto

### Base de datos no conecta
- Verificar `MONGODB_URI` en `.env`
- Comprobar conectividad: `telnet tu-cluster.mongodb.net 27017`

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de PM2 y Nginx
2. Verifica la configuración DNS
3. Comprueba que todas las variables de entorno estén correctas
4. Asegúrate de que los puertos 80 y 443 estén abiertos en el firewall

---

**¡Tu aplicación FlowCasa Zen estará lista para recibir usuarios en www.flowcasazen.com! 🧘‍♀️✨**

