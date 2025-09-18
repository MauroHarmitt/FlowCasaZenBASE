# 🚀 FlowCasaZen Server - Backend API

Servidor backend para la plataforma FlowCasaZen con autenticación JWT y base de datos MongoDB.

## ✨ Características

- �� **Autenticación JWT** completa
- 🗄️ **Base de datos MongoDB** con Mongoose
- 🛡️ **Seguridad avanzada** (Helmet, CORS, Rate Limiting)
- 🔑 **Contraseñas hasheadas** con bcrypt
- 👥 **Gestión de usuarios** (estudiantes, profesores, admin)
- 📊 **Validación de datos** robusta
- 🔄 **API RESTful** completa

## �� Requisitos

- Node.js 14 o superior
- MongoDB Atlas (configurado)
- npm o yarn

## ⚙️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` con tus configuraciones:
   ```env
   MONGODB_URI=tu_conexion_mongodb
   JWT_SECRET=tu_secreto_jwt
   PORT=5000
   ```

3. **Iniciar servidor:**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 🔗 Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios
- `GET /api/auth/profile` - Obtener perfil (requiere token)
- `PUT /api/auth/profile` - Actualizar perfil (requiere token)

### Usuarios (Admin)
- `GET /api/users` - Listar todos los usuarios
- `DELETE /api/users/:userId` - Eliminar usuario

### Utilidades
- `GET /health` - Health check del servidor

##  Autenticación

### Registro
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "password123",
  "country": "Argentina",
  "timezone": "America/Argentina/Buenos_Aires",
  "role": "student"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "password123"
}
```

### Uso del Token
```bash
Authorization: Bearer tu_jwt_token_aqui
```

## 👨‍💼 Usuario Admin por Defecto

- **Email:** admin@flowcasa-zen.com
- **Contraseña:** admin123

## ️ Seguridad

- Contraseñas hasheadas con bcrypt (12 rounds)
- Tokens JWT con expiración de 7 días
- Rate limiting (100 requests por 15 minutos)
- Headers de seguridad con Helmet
- CORS configurado
- Validación de datos de entrada

## 📊 Base de Datos

### Modelo User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (único),
  password: String (hasheado),
  country: String,
  timezone: String,
  role: ['student', 'teacher', 'admin'],
  isVerified: Boolean,
  isFirstLogin: Boolean,
  interests: [String],
  profession: String,
  documentType: String,
  documentNumber: String,
  paymentMethods: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Scripts

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon
- `npm test` - Ejecutar tests (pendiente)

## ⚙️ Configuración

### Variables de Entorno Requeridas
- `MONGODB_URI` - Conexión a MongoDB
- `JWT_SECRET` - Secreto para JWT
- `PORT` - Puerto del servidor (default: 5000)
- `FRONTEND_URL` - URL del frontend para CORS

## 📝 Logs

El servidor incluye logging detallado:
- ✅ Requests entrantes
- ✅ Operaciones de base de datos
- ❌ Errores y excepciones
- 🔐 Eventos de autenticación
