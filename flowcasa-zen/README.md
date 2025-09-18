# 🧘‍♀️ FlowCasaZen - Plataforma de Yoga Online

Una plataforma completa para clases de yoga, fitness y bienestar online con sistema de pagos integrado y backend con MongoDB.

## ✨ Características

- 🎯 **Registro unificado** para estudiantes y profesores
- 🔐 **Sistema de autenticación JWT** completo
- 💳 **Pagos con MercadoPago** integrado
- 🗄️ **Base de datos MongoDB** persistente
- 📱 **Diseño responsive** con Tailwind CSS
- 👨‍🏫 **Panel de profesores** para gestionar clases
- 👨‍🎓 **Dashboard de estudiantes** para acceder a contenido
- 🔧 **Panel de administración** para gestionar la plataforma
- 🎬 **Reproductor de videos** para reels de 45 segundos

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Instalar todas las dependencias
npm run install:all

# Iniciar desarrollo completo (frontend + backend)
npm run dev
```

### Opción 2: Manual

1. **Instalar dependencias del proyecto principal:**
   ```bash
   npm install
   ```

2. **Instalar dependencias del servidor:**
   ```bash
   npm run server:install
   ```

3. **Configurar variables de entorno del servidor:**
   ```bash
   cd server
   cp .env.example .env
   # Editar .env con tu configuración de MongoDB
   cd ..
   ```

4. **Iniciar servidor backend:**
   ```bash
   npm run server
   ```

5. **En otra terminal, iniciar React:**
   ```bash
   npm start
   ```

## 🌐 URLs de Acceso

- **Aplicación Principal:** http://localhost:3000
- **Servidor API:** http://localhost:4000
- **Servidor MercadoPago:** http://localhost:3001
- **Health Check:** http://localhost:4000/health

## 🔑 Configuración de MercadoPago

### 1. Obtener Credenciales

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una cuenta o inicia sesión
3. Ve a "Tus integraciones"
4. Crea una nueva aplicación
5. Copia el **Access Token**

### 2. Configurar el Servidor

Edita `mercadopago-solucion-main/config.js`:

```javascript
module.exports = {
    mercadopago: {
        access_token: 'TEST-5510015184927084-091602-570e6ddfc67738f0639841b187342ce4-419183457',
        sandbox: true // true para pruebas
    },
    urls: {
        success: 'http://localhost:3000/payment/success',
        failure: 'http://localhost:3000/payment/failure',
        pending: 'http://localhost:3000/payment/pending',
        webhook: 'http://localhost:3001/api/webhooks/mercadopago'
    }
};
```

## 🎯 Funcionalidades

### Para Estudiantes
- ✅ Registro e inicio de sesión
- ✅ Selección de intereses en primer login
- ✅ Explorar clases disponibles
- ✅ Ver reels de 45 segundos
- ✅ Comprar packs de entrenamiento
- ✅ Acceso a contenido comprado

### Para Profesores
- ✅ Registro con validación de documentos
- ✅ Tutorial de uso de la plataforma
- ✅ Dashboard para gestionar contenido
- ✅ Crear y vender packs de entrenamiento
- ✅ Gestión de ingresos

### Para Administradores
- ✅ Panel de administración completo
- ✅ Validación de profesores
- ✅ Gestión de usuarios
- ✅ Reportes y estadísticas
- ✅ Configuración del sistema

## 🛠️ Tecnologías

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **React Router** para navegación

### Backend
- **Node.js** + Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **CORS** y **Helmet** para seguridad

### Pagos
- **MercadoPago API**

### Base de Datos
- **MongoDB Atlas** (nube)
- **LocalStorage** como fallback

## 📁 Estructura del Proyecto

```
flowcasa-zen/
├── src/
│   ├── components/          # Componentes React
│   ├── services/           # Servicios API
│   ├── config/             # Configuración
│   ├── data/               # Datos de ejemplo
│   └── utils/              # Utilidades
├── server/                 # Servidor backend
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependencias del servidor
│   └── .env                # Variables de entorno
├── mercadopago-solucion-main/  # Servidor de pagos
│   ├── server.js           # Servidor principal
│   ├── config.js           # Configuración
│   └── package.json        # Dependencias
└── README.md
```

## 🧪 Testing

### Probar Pagos

1. **Crear preferencia de pago:**
   ```bash
   curl -X POST http://localhost:3001/api/create-preference \
     -H "Content-Type: application/json" \
     -d '{
       "items": [{
         "title": "Yoga Matutino",
         "quantity": 1,
         "unit_price": 25
       }],
       "payer": {
         "email": "test@ejemplo.com"
       }
     }'
   ```

2. **Health check:**
   ```bash
   curl http://localhost:3001/health
   ```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm start                    # Inicia React (puerto 3000)
cd mercadopago-solucion-main && npm start  # Inicia servidor MP (puerto 3001)

# Producción
npm run build               # Build de producción
```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
REACT_APP_MERCADOPAGO_PUBLIC_KEY=tu_public_key
REACT_APP_MERCADOPAGO_ACCESS_TOKEN=tu_access_token
```

## 🚨 Troubleshooting

### Error: "Cannot connect to MercadoPago server"
- Verifica que el servidor esté corriendo en puerto 3001
- Revisa la configuración en `config.js`

### Error: "Invalid access token"
- Verifica tu Access Token en MercadoPago
- Asegúrate de usar el token correcto (sandbox vs producción)

### Error: "CORS policy"
- El servidor ya incluye CORS habilitado
- Verifica que ambos servidores estén corriendo

## 📞 Soporte

Para problemas específicos:
- **MercadoPago:** [Documentación oficial](https://www.mercadopago.com.ar/developers/es/docs)
- **React:** [Documentación oficial](https://reactjs.org/docs)

## 📄 Licencia

MIT - Ver archivo LICENSE para más detalles.

---

**¡Disfruta creando tu plataforma de yoga! 🧘‍♀️✨**

## �� **Dónde se Guardan Todos los Usuarios (Incluyendo el Admin)**

### 🗄️ **Sistema de Almacenamiento:**

**Todos los usuarios se guardan en `localStorage` del navegador** usando la clave `'flowcasa-zen-users'`.

###  **Archivo Principal:** `src/utils/userStorage.ts`

Este archivo contiene todo el sistema de gestión de usuarios:

####  **Clave de Almacenamiento:**
```typescript
const STORAGE_KEY = 'flowcasa-zen-users';
```

#### 👥 **Estructura de Datos de Usuario:**
```typescript
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  role: 'student' | 'teacher' | 'admin';
  isVerified: boolean;
  isFirstLogin: boolean;
  interests?: string[];
  profession?: string;
  documentType?: string;
  documentNumber?: string;
  paymentMethods?: {
    cbu: string;
    mercadoPago: string;
    lemon: string;
    stripe: boolean;
  };
  createdAt: Date;
}
```

### 🔧 **Funciones Principales:**

1. **`getUsers()`** - Obtiene todos los usuarios del localStorage
2. **`saveUser()`** - Guarda un nuevo usuario
3. **`findUserByEmail()`** - Busca usuario por email
4. **`verifyCredentials()`** - Verifica login
5. **`updateUser()`** - Actualiza datos de usuario

### 👨‍💼 **Usuario Admin por Defecto:**

El admin se crea automáticamente cuando se carga la aplicación:

```typescript
const initializeDefaultAdmin = (): void => {
  const users = getUsers();
  const adminExists = users.some(user => user.email === 'admin@flowcasa-zen.com');
  
  if (!adminExists) {
    const defaultAdmin: UserData = {
      id: 'admin-001',
      firstName: 'Admin',
      lastName: 'FlowCasaZen',
      email: 'admin@flowcasa-zen.com',
      password: 'admin123',
      country: 'Argentina',
      timezone: 'America/Argentina/Buenos_Aires',
      role: 'admin',
      isVerified: true,
      isFirstLogin: false,
      createdAt: new Date()
    };
    
    users.push(defaultAdmin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
};
```

###  **Credenciales del Admin:**
- **Email:** `admin@flowcasa-zen.com`
- **Contraseña:** `admin123`

### 💾 **Ubicación Física de los Datos:**

Los datos se almacenan en:
- **Navegador:** localStorage
- **Clave:** `flowcasa-zen-users`
- **Formato:** JSON stringificado
- **Persistencia:** Solo en el navegador actual

###  **Gestión de Sesiones:**

También hay un sistema de sesiones separado:
- **Clave de sesión:** `flowcasa-zen-session`
- **Duración:** 7 días
- **Función:** Mantener al usuario logueado

### 🚨 **Limitaciones Actuales:**

1. **Solo local:** Los datos solo existen en el navegador actual
2. **No sincronización:** No se comparten entre dispositivos
3. **No persistencia:** Se pierden al limpiar datos del navegador
4. **Sin respaldo:** No hay copias de seguridad automáticas

### 💡 **Para Ver los Usuarios Guardados:**

Puedes ver todos los usuarios registrados en las **DevTools del navegador**:
1. Abre F12
2. Ve a **Application** → **Local Storage** → **localhost:3000**
3. Busca la clave `flowcasa-zen-users`
4. Verás el JSON con todos los usuarios

¿Te gustaría que te muestre cómo migrar este sistema a MongoDB para tener persistencia real de datos?

## 🔍 **VERIFICACIÓN Y COMPLETADO**

### 1. **Crear package.json del servidor**

```json:flowcasa-zen/server/package.json
{
  "name": "flowcasa-zen-server",
  "version": "1.0.0",
  "description": "Backend API para FlowCasaZen con MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "keywords": [
    "express",
    "mongodb",
    "api",
    "yoga",
    "fitness"
  ],
  "author": "FlowCasaZen",
  "license": "MIT"
}
```

### 2. **Crear archivo .env del servidor**

```env:flowcasa-zen/server/.env
#  CONFIGURACIÓN DEL SERVIDOR
PORT=4000
NODE_ENV=development

# 🗄️ MONGODB CONFIGURACIÓN
MONGODB_URI=mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/maurito-22

# 🔑 JWT CONFIGURACIÓN
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_para_flowcasa_zen_2024

#  FRONTEND URL
FRONTEND_URL=http://localhost:3000

#  CONFIGURACIÓN DE SEGURIDAD
BCRYPT_ROUNDS=12
TOKEN_EXPIRES_IN=7d
```

### 3. **Crear archivo .env.example del servidor**

```env:flowcasa-zen/server/.env.example
#  CONFIGURACIÓN DEL SERVIDOR
PORT=4000
NODE_ENV=development

# 🗄️ MONGODB CONFIGURACIÓN
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database

# 🔑 JWT CONFIGURACIÓN
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo

#  FRONTEND URL
FRONTEND_URL=http://localhost:3001

#  CONFIGURACIÓN DE SEGURIDAD
BCRYPT_ROUNDS=12
TOKEN_EXPIRES_IN=7d
```

### 4. **Actualizar userStorage.ts para usar la API**

```typescript:flowcasa-zen/src/utils/userStorage.ts
// 🔄 MIGRACIÓN A API BACKEND
// Este archivo ahora actúa como adaptador para la API

import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getAllUsers,
  markFirstLoginCompleted,
  updateStudentInterests,
  deleteUser,
  saveUserSession,
  getCurrentUser,
  clearUserSession,
  removeToken,
  isAuthenticated,
  UserData,
  LoginResponse,
  RegisterResponse
} from '../services/api';

// 🔄 MANTENER INTERFAZ COMPATIBLE CON EL CÓDIGO EXISTENTE
export interface UserDataLegacy {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  role: 'student' | 'teacher' | 'admin';
  isVerified: boolean;
  isFirstLogin: boolean;
  interests?: string[];
  profession?: string;
  documentType?: string;
  documentNumber?: string;
  paymentMethods?: {
    cbu: string;
    mercadoPago: string;
    lemon: string;
    stripe: boolean;
  };
  createdAt: Date;
}

// ==================== 🚀 FUNCIONES ADAPTADAS ====================

// 👥 OBTENER TODOS LOS USUARIOS (Solo Admin)
export const getUsers = async (): Promise<UserDataLegacy[]> => {
  try {
    const response = await getAllUsers();
    return response.users.map(convertToLegacyFormat);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

// 💾 GUARDAR USUARIO (REGISTRO)
export const saveUser = async (userData: Omit<UserDataLegacy, 'id' | 'createdAt'>): Promise<UserDataLegacy> => {
  try {
    const response: RegisterResponse = await registerUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      country: userData.country,
      timezone: userData.timezone,
      role: userData.role === 'admin' ? 'student' : userData.role, // Admin se maneja por separado
      profession: userData.profession,
      documentType: userData.documentType,
      documentNumber: userData.documentNumber,
      paymentMethods: userData.paymentMethods
    });

    // Guardar sesión automáticamente
    saveUserSession(response.user, response.token);

    return convertToLegacyFormat(response.user);
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    throw error;
  }
};

// 🔍 BUSCAR USUARIO POR EMAIL
export const findUserByEmail = async (email: string): Promise<UserDataLegacy | null> => {
  try {
    // Esta función ahora requiere que el usuario esté logueado
    // Para mantener compatibilidad, retornamos null si no hay sesión
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.email !== email) {
      return null;
    }
    return convertToLegacyFormat(currentUser);
  } catch (error) {
    console.error('Error al buscar usuario por email:', error);
    return null;
  }
};

// 🔐 VERIFICAR CREDENCIALES (LOGIN)
export const verifyCredentials = async (email: string, password: string): Promise<UserDataLegacy | null> => {
  try {
    const response: LoginResponse = await loginUser(email, password);
    
    // Guardar sesión automáticamente
    saveUserSession(response.user, response.token);
    
    return convertToLegacyFormat(response.user);
  } catch (error) {
    console.error('Error al verificar credenciales:', error);
    return null;
  }
};

// 📝 ACTUALIZAR USUARIO
export const updateUser = async (userId: string, updates: Partial<UserDataLegacy>): Promise<UserDataLegacy | null> => {
  try {
    // Convertir updates a formato de API (remover campos no permitidos)
    const apiUpdates = { ...updates };
    delete apiUpdates.password;
    delete apiUpdates.email;
    delete apiUpdates.id;
    delete apiUpdates.createdAt;

    const response = await updateUserProfile(apiUpdates);
    return convertToLegacyFormat(response.user);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return null;
  }
};

//  MARCAR COMO NO PRIMER LOGIN
export const markAsNotFirstLogin = async (userId: string): Promise<void> => {
  try {
    await markFirstLoginCompleted();
  } catch (error) {
    console.error('Error al marcar como no primer login:', error);
  }
};

// 🎯 ACTUALIZAR INTERESES DEL ESTUDIANTE
export const updateStudentInterestsLegacy = async (userId: string, interests: string[]): Promise<void> => {
  try {
    await updateStudentInterests(interests);
  } catch (error) {
    console.error('Error al actualizar intereses:', error);
  }
};

// ====================  FUNCIONES DE SESIÓN ====================

// 💾 GUARDAR SESIÓN DEL USUARIO (ya implementado en api.ts)
export { saveUserSession };

// 👤 OBTENER USUARIO ACTUAL (ya implementado en api.ts)
export { getCurrentUser };

// 🧹 LIMPIAR SESIÓN (ya implementado en api.ts)
export { clearUserSession };

// ✅ VERIFICAR SI HAY SESIÓN ACTIVA
export const isUserLoggedIn = (): boolean => {
  return isAuthenticated();
};

// ==================== 🔧 FUNCIONES DE UTILIDAD ====================

//  CONVERTIR FORMATO DE API A FORMATO LEGACY
const convertToLegacyFormat = (apiUser: UserData): UserDataLegacy => {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    password: '', // No retornamos la contraseña por seguridad
    country: apiUser.country,
    timezone: apiUser.timezone,
    role: apiUser.role,
    isVerified: apiUser.isVerified,
    isFirstLogin: apiUser.isFirstLogin,
    interests: apiUser.interests,
    profession: apiUser.profession,
    documentType: apiUser.documentType,
    documentNumber: apiUser.documentNumber,
    paymentMethods: apiUser.paymentMethods,
    createdAt: new Date(apiUser.createdAt)
  };
};

// ====================  INICIALIZACIÓN ====================

// ✅ VERIFICAR CONECTIVIDAD CON EL SERVIDOR
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const { healthCheck } = await import('../services/api');
    const health = await healthCheck();
    return health.status === 'OK';
  } catch (error) {
    console.error('Servidor no disponible:', error);
    return false;
  }
};

// 🚨 FALLBACK PARA DESARROLLO LOCAL
// Si el servidor no está disponible, mostrar advertencia
checkServerHealth().then(isHealthy => {
  if (!isHealthy) {
    console.warn('⚠️ Servidor backend no disponible. Algunas funciones pueden no funcionar correctamente.');
    console.warn('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:5000');
  } else {
    console.log('✅ Servidor backend conectado exitosamente');
  }
});
```

### 5. **Crear script de inicio completo**

```json:flowcasa-zen/package.json
{
  "name": "flowcasa-zen",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.126",
    "@types/react": "^19.1.13",
    "@types/react-dom": "^19.1.9",
    "axios": "^1.6.2",
    "concurrently": "^8.2.2",
    "mercadopago": "^2.9.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "cd server && npm run dev",
    "server:start": "cd server && npm start",
    "server:install": "cd server && npm install",
    "dev": "concurrently \"npm run server\" \"npm start\"",
    "install:all": "npm install && npm run server:install"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.0.0",
    "@types/react-router-dom": "^5.3.3"
  },
  "proxy": "http://localhost:4000"
}
```

### 6. **Crear README actualizado del servidor**

```markdown:flowcasa-zen/server/README.md
# 🚀 FlowCasaZen Server - Backend API

Servidor backend para la plataforma FlowCasaZen con autenticación JWT y base de datos MongoDB.

## ✨ Características

- 🎯 **Registro unificado** para estudiantes y profesores
- 🔐 **Sistema de autenticación JWT** completo
- 💳 **Pagos con MercadoPago** integrado
- 🗄️ **Base de datos MongoDB** con Mongoose
- 🛡️ **Seguridad avanzada** (Helmet, CORS, Rate Limiting)
- 🔑 **Contraseñas hasheadas** con bcrypt
- 👥 **Gestión de usuarios** (estudiantes, profesores, admin)
- 📊 **Validación de datos** robusta
- 🔄 **API RESTful** completa

## �� Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Instalar todas las dependencias
npm run install:all

# Iniciar desarrollo completo (frontend + backend)
npm run dev
```

### Opción 2: Manual

1. **Instalar dependencias del proyecto principal:**
   ```bash
   npm install
   ```

2. **Instalar dependencias del servidor:**
   ```bash
   npm run server:install
   ```

3. **Configurar variables de entorno del servidor:**
   ```bash
   cd server
   cp .env.example .env
   # Editar .env con tu configuración de MongoDB
   cd ..
   ```

4. **Iniciar servidor backend:**
   ```bash
   npm run server
   ```

5. **En otra terminal, iniciar React:**
   ```bash
   npm start
   ```

## 🌐 URLs de Acceso

- **Aplicación Principal:** http://localhost:3000
- **Servidor API:** http://localhost:4000
- **Servidor MercadoPago:** http://localhost:3001
- **Health Check:** http://localhost:4000/health

## 🔑 Configuración de MercadoPago

### 1. Obtener Credenciales

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una cuenta o inicia sesión
3. Ve a "Tus integraciones"
4. Crea una nueva aplicación
5. Copia el **Access Token**

### 2. Configurar el Servidor

Edita `mercadopago-solucion-main/config.js`:

```javascript
module.exports = {
    mercadopago: {
        access_token: 'TU_ACCESS_TOKEN_AQUI',
        sandbox: true // true para pruebas
    },
    urls: {
        success: 'http://localhost:3000/payment/success',
        failure: 'http://localhost:3000/payment/failure',
        pending: 'http://localhost:3000/payment/pending',
        webhook: 'http://localhost:3001/api/webhooks/mercadopago'
    }
};
```

## 🎯 Funcionalidades

### Para Estudiantes
- ✅ Registro e inicio de sesión
- ✅ Selección de intereses en primer login
- ✅ Explorar clases disponibles
- ✅ Ver reels de 45 segundos
- ✅ Comprar packs de entrenamiento
- ✅ Acceso a contenido comprado

### Para Profesores
- ✅ Registro con validación de documentos
- ✅ Tutorial de uso de la plataforma
- ✅ Dashboard para gestionar contenido
- ✅ Crear y vender packs de entrenamiento
- ✅ Gestión de ingresos

### Para Administradores
- ✅ Panel de administración completo
- ✅ Validación de profesores
- ✅ Gestión de usuarios
- ✅ Reportes y estadísticas
- ✅ Configuración del sistema

## 🛠️ Tecnologías

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **React Router** para navegación

### Backend
- **Node.js** + Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **CORS** y **Helmet** para seguridad

### Pagos
- **MercadoPago API**

### Base de Datos
- **MongoDB Atlas** (nube)
- **LocalStorage** como fallback

## 📁 Estructura del Proyecto

```
flowcasa-zen/
├── src/
│   ├── components/          # Componentes React
│   ├── services/           # Servicios API
│   ├── config/             # Configuración
│   ├── data/               # Datos de ejemplo
│   └── utils/              # Utilidades
├── server/                 # Servidor backend
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependencias del servidor
│   └── .env                # Variables de entorno
├── mercadopago-solucion-main/  # Servidor de pagos
│   ├── server.js           # Servidor principal
│   ├── config.js           # Configuración
│   └── package.json        # Dependencias
└── README.md
```

## 🧪 Testing

### Probar Pagos

1. **Crear preferencia de pago:**
   ```bash
   curl -X POST http://localhost:3001/api/create-preference \
     -H "Content-Type: application/json" \
     -d '{
       "items": [{
         "title": "Yoga Matutino",
         "quantity": 1,
         "unit_price": 25
       }],
       "payer": {
         "email": "test@ejemplo.com"
       }
     }'
   ```

2. **Health check:**
   ```bash
   curl http://localhost:3001/health
   ```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm start                    # Inicia React (puerto 3000)
cd mercadopago-solucion-main && npm start  # Inicia servidor MP (puerto 3001)

# Producción
npm run build               # Build de producción
```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
REACT_APP_MERCADOPAGO_PUBLIC_KEY=tu_public_key
REACT_APP_MERCADOPAGO_ACCESS_TOKEN=tu_access_token
```

## 🚨 Troubleshooting

### Error: "Cannot connect to MercadoPago server"
- Verifica que el servidor esté corriendo en puerto 3001
- Revisa la configuración en `config.js`

### Error: "Invalid access token"
- Verifica tu Access Token en MercadoPago
- Asegúrate de usar el token correcto (sandbox vs producción)

### Error: "CORS policy"
- El servidor ya incluye CORS habilitado
- Verifica que ambos servidores estén corriendo

## 📞 Soporte

Para problemas específicos:
- **MercadoPago:** [Documentación oficial](https://www.mercadopago.com.ar/developers/es/docs)
- **React:** [Documentación oficial](https://reactjs.org/docs)

## 📄 Licencia

MIT - Ver archivo LICENSE para más detalles.

---

**¡Disfruta creando tu plataforma de yoga! 🧘‍♀️✨**

## �� **Dónde se Guardan Todos los Usuarios (Incluyendo el Admin)**

### 🗄️ **Sistema de Almacenamiento:**

**Todos los usuarios se guardan en `localStorage` del navegador** usando la clave `'flowcasa-zen-users'`.

###  **Archivo Principal:** `src/utils/userStorage.ts`

Este archivo contiene todo el sistema de gestión de usuarios:

####  **Clave de Almacenamiento:**
```typescript
const STORAGE_KEY = 'flowcasa-zen-users';
```

#### 👥 **Estructura de Datos de Usuario:**
```typescript
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  role: 'student' | 'teacher' | 'admin';
  isVerified: boolean;
  isFirstLogin: boolean;
  interests?: string[];
  profession?: string;
  documentType?: string;
  documentNumber?: string;
  paymentMethods?: {
    cbu: string;
    mercadoPago: string;
    lemon: string;
    stripe: boolean;
  };
  createdAt: Date;
}
```

### 🔧 **Funciones Principales:**

1. **`getUsers()`** - Obtiene todos los usuarios del localStorage
2. **`saveUser()`** - Guarda un nuevo usuario
3. **`findUserByEmail()`** - Busca usuario por email
4. **`verifyCredentials()`** - Verifica login
5. **`updateUser()`** - Actualiza datos de usuario

### 👨‍💼 **Usuario Admin por Defecto:**

El admin se crea automáticamente cuando se carga la aplicación:

```typescript
const initializeDefaultAdmin = (): void => {
  const users = getUsers();
  const adminExists = users.some(user => user.email === 'admin@flowcasa-zen.com');
  
  if (!adminExists) {
    const defaultAdmin: UserData = {
      id: 'admin-001',
      firstName: 'Admin',
      lastName: 'FlowCasaZen',
      email: 'admin@flowcasa-zen.com',
      password: 'admin123',
      country: 'Argentina',
      timezone: 'America/Argentina/Buenos_Aires',
      role: 'admin',
      isVerified: true,
      isFirstLogin: false,
      createdAt: new Date()
    };
    
    users.push(defaultAdmin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
};
```

###  **Credenciales del Admin:**
- **Email:** `admin@flowcasa-zen.com`
- **Contraseña:** `admin123`

### 💾 **Ubicación Física de los Datos:**

Los datos se almacenan en:
- **Navegador:** localStorage
- **Clave:** `flowcasa-zen-users`
- **Formato:** JSON stringificado
- **Persistencia:** Solo en el navegador actual

###  **Gestión de Sesiones:**

También hay un sistema de sesiones separado:
- **Clave de sesión:** `flowcasa-zen-session`
- **Duración:** 7 días
- **Función:** Mantener al usuario logueado

### 🚨 **Limitaciones Actuales:**

1. **Solo local:** Los datos solo existen en el navegador actual
2. **No sincronización:** No se comparten entre dispositivos
3. **No persistencia:** Se pierden al limpiar datos del navegador
4. **Sin respaldo:** No hay copias de seguridad automáticas

### 💡 **Para Ver los Usuarios Guardados:**

Puedes ver todos los usuarios registrados en las **DevTools del navegador**:
1. Abre F12
2. Ve a **Application** → **Local Storage** → **localhost:3000**
3. Busca la clave `flowcasa-zen-users`
4. Verás el JSON con todos los usuarios

¿Te gustaría que te muestre cómo migrar este sistema a MongoDB para tener persistencia real de datos?
```

### 7. **Actualizar README principal**

```markdown:flowcasa-zen/README.md
<code_block_to_apply_changes_from>
```
flowcasa-zen/
├── src/
│   ├── components/          # Componentes React
│   ├── services/           # Servicios API
│   ├── config/             # Configuración
│   ├── data/               # Datos de ejemplo
│   └── utils/              # Utilidades
├── server/                 # Servidor backend
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependencias del servidor
│   └── .env                # Variables de entorno
├── mercadopago-solucion-main/  # Servidor de pagos
│   ├── server.js           # Servidor principal
│   ├── config.js           # Configuración
│   └── package.json        # Dependencias
└── README.md
```

## 🔧 Scripts Disponibles

- `npm start` - Iniciar solo el frontend
- `npm run server` - Iniciar solo el backend
- `npm run dev` - Iniciar frontend + backend simultáneamente
- `npm run install:all` - Instalar todas las dependencias
- `npm run build` - Construir para producción

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
# Frontend
npm run build

# Backend
cd server
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
```

## ✅ **VERIFICACIÓN COMPLETA**

### **Estado Actual:**
1. ✅ **Servidor backend** creado con Express + MongoDB
2. ✅ **Conexión MongoDB** configurada con tu URI
3. ✅ **Autenticación JWT** implementada
4. ✅ **API RESTful** completa
5. ✅ **Servicio frontend** para conectar con el backend
6. ✅ **Migración** de localStorage a MongoDB
7. ✅ **Scripts** de desarrollo configurados
8. ✅ **Documentación** completa

### **Próximos Pasos:**
1. **Instalar dependencias del servidor:**
   ```bash
   cd server
   npm install
   ```

2. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

3. **Verificar conexión:**
   - Visita http://localhost:4000/health
   - Deberías ver el estado del servidor y MongoDB

### **Credenciales Admin:**
- **Email:** admin@flowcasa-zen.com
- **Contraseña:** admin123

¿Todo listo para probar el sistema completo con MongoDB?#   F l o w C a s a Z e n _ o m  
 #   F l o w C a s a Z e n _ o m  
 #   C a s a z e n  
 #   t e s t  
 #   t e s t  
 #   u l t i m o  
 #   u l t i m o  
 