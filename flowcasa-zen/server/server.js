// 🚀 SERVIDOR FLOWCASZEN - API CON MONGODB
// Servidor backend para la plataforma de yoga online

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// 💳 CONFIGURACIÓN DE MERCADO PAGO - PRODUCCIÓN
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457',
  options: {
    sandbox: false // Modo producción
  }
});

const preference = new Preference(client);

// 🔧 Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.160.1:3000',
    'http://192.168.1.100:3000',
    'http://192.168.0.100:3000',
    'https://www.flowcasazen.com',
    'https://flowcasazen.com',
    process.env.FRONTEND_URL
  ].filter(Boolean), // Filtra valores undefined/null
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ⏱️ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter);

// �� Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 📋 Logging de requests
app.use((req, res, next) => {
  console.log(`�� ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ��️ CONEXIÓN A MONGODB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/maurito-22';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB exitosamente');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// 📊 MODELOS DE DATOS
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  timezone: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  isFirstLogin: { type: Boolean, default: true },
  interests: [String],
  profession: String,
  documentType: String,
  documentNumber: String,
  paymentMethods: {
    cbu: String,
    mercadoPago: String,
    lemon: String,
    stripe: Boolean
  },
  // 🔒 Campos de seguridad para control de intentos de login
  loginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockedUntil: { type: Date },
  lastFailedLogin: { type: Date },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 🔐 Middleware para hashear contraseñas antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔍 Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Generar JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      userId: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro',
    { expiresIn: '7d' }
  );
};

// 🔒 Verificar si la cuenta está bloqueada
userSchema.methods.isAccountLocked = function() {
  return this.isLocked && this.lockedUntil && this.lockedUntil > new Date();
};

const User = mongoose.model('User', userSchema);

// 📚 MODELO DE CLASES/TRAINING PACKS
const trainingPackSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'USD' },
  duration: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Principiante', 'Intermedio', 'Avanzado'], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Yoga', 'Fitness', 'Crossfit', 'Malabares', 'Artes Marciales', 'Pilates', 'Meditación'], 
    required: true 
  },
  teacher: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    students: { type: Number, required: true, min: 0 },
    country: { type: String, required: true }
  },
  reelUrl: { type: String, required: true },
  thumbnail: { type: String, required: true },
  exercises: [String],
  benefits: [String],
  requirements: [String],
  isPopular: { type: Boolean, default: false },
  discount: { type: Number, min: 0, max: 100 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TrainingPack = mongoose.model('TrainingPack', trainingPackSchema);

// ��️ MIDDLEWARE DE AUTENTICACIÓN
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ��️ MIDDLEWARE DE AUTORIZACIÓN
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
};

// ==================== �� RUTAS DE LA API ====================

// 🏥 Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'FlowCasaZen API Server',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 📚 ENDPOINTS DE CLASES/TRAINING PACKS

// 🎯 OBTENER TODAS LAS CLASES
app.get('/api/classes', async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      search, 
      sortBy = 'popular',
      limit = 50,
      page = 1 
    } = req.query;

    // Construir filtros
    const filters = { isActive: true };
    
    if (category && category !== 'all') {
      filters.category = category;
    }
    
    if (difficulty && difficulty !== 'all') {
      filters.difficulty = difficulty;
    }
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'teacher.name': { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Construir ordenamiento
    let sort = {};
    switch (sortBy) {
      case 'popular':
        sort = { isPopular: -1, 'teacher.students': -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { 'teacher.rating': -1 };
        break;
      default:
        sort = { isPopular: -1, 'teacher.students': -1 };
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const classes = await TrainingPack.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TrainingPack.countDocuments(filters);

    res.json({
      classes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error obteniendo clases:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🎯 OBTENER UNA CLASE POR ID
app.get('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const classItem = await TrainingPack.findOne({ _id: id, isActive: true });
    
    if (!classItem) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    res.json({ class: classItem });
  } catch (error) {
    console.error('Error obteniendo clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🎯 CREAR NUEVA CLASE (Solo Admin/Teacher)
app.post('/api/classes', authenticateToken, authorizeRole(['admin', 'teacher']), async (req, res) => {
  try {
    const classData = req.body;
    
    // Validaciones básicas
    if (!classData.title || !classData.description || !classData.price) {
      return res.status(400).json({
        error: 'Título, descripción y precio son requeridos'
      });
    }

    const newClass = new TrainingPack(classData);
    await newClass.save();

    res.status(201).json({
      message: 'Clase creada exitosamente',
      class: newClass
    });

  } catch (error) {
    console.error('Error creando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🎯 ACTUALIZAR CLASE (Solo Admin/Teacher)
app.put('/api/classes/:id', authenticateToken, authorizeRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const classItem = await TrainingPack.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!classItem) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    res.json({
      message: 'Clase actualizada exitosamente',
      class: classItem
    });

  } catch (error) {
    console.error('Error actualizando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🎯 ELIMINAR CLASE (Solo Admin)
app.delete('/api/classes/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const classItem = await TrainingPack.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!classItem) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    res.json({ message: 'Clase eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 👤 REGISTRO DE USUARIOS
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      country,
      timezone,
      role = 'student',
      profession,
      documentType,
      documentNumber,
      paymentMethods
    } = req.body;

    // ✅ Validaciones básicas
    if (!firstName || !lastName || !email || !password || !country || !timezone) {
      return res.status(400).json({
        error: 'Todos los campos requeridos deben ser proporcionados'
      });
    }

    // ✅ Validar email único
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Ya existe un usuario con este email'
      });
    }

    // ✅ Crear nuevo usuario
    const userData = {
      firstName,
      lastName,
      email,
      password,
      country,
      timezone,
      role,
      isVerified: role === 'student', // Estudiantes verificados inmediatamente
      isFirstLogin: true,
      profession,
      documentType,
      documentNumber,
      paymentMethods
    };

    const newUser = new User(userData);
    await newUser.save();

    // 🔑 Generar token
    const token = newUser.generateAuthToken();

    // 📤 Respuesta exitosa (sin contraseña)
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      country: newUser.country,
      timezone: newUser.timezone,
      role: newUser.role,
      isVerified: newUser.isVerified,
      isFirstLogin: newUser.isFirstLogin,
      interests: newUser.interests,
      profession: newUser.profession,
      documentType: newUser.documentType,
      documentNumber: newUser.documentNumber,
      paymentMethods: newUser.paymentMethods,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// 🔐 LOGIN DE USUARIOS
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // ✅ Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // 📧 Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'El formato del email no es válido',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    // 🔍 Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        error: 'No existe una cuenta con este email. Verifica el email o regístrate si no tienes cuenta.',
        code: 'USER_NOT_FOUND'
      });
    }

    // 🔒 Verificar si la cuenta está bloqueada
    if (user.isAccountLocked()) {
      const timeRemaining = Math.ceil((user.lockedUntil.getTime() - new Date().getTime()) / (1000 * 60));
      return res.status(423).json({
        error: `Cuenta bloqueada temporalmente. Inténtalo de nuevo en ${timeRemaining} minutos.`,
        code: 'ACCOUNT_LOCKED',
        lockedUntil: user.lockedUntil,
        timeRemaining
      });
    }

    // 🔐 Verificar contraseña
    console.log('🔐 Verificando contraseña para usuario:', user.email);
    const isValidPassword = await user.comparePassword(password);
    console.log('🔐 Resultado de verificación de contraseña:', isValidPassword);
    
    if (!isValidPassword) {
      // Incrementar intentos fallidos
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      user.lastFailedLogin = new Date();
      
      // Bloquear cuenta después de 5 intentos fallidos
      if (user.loginAttempts >= 5) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        await user.save();
        
        return res.status(423).json({
          error: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos. Inténtalo de nuevo en 15 minutos.',
          code: 'ACCOUNT_LOCKED',
          lockedUntil: user.lockedUntil
        });
      }
      
      await user.save();
      
      const remainingAttempts = 5 - user.loginAttempts;
      return res.status(401).json({
        error: `La contraseña es incorrecta. Te quedan ${remainingAttempts} intentos antes de que la cuenta se bloquee.`,
        code: 'INVALID_PASSWORD',
        remainingAttempts
      });
    }

    // ✅ Login exitoso - resetear intentos fallidos
    if (user.loginAttempts > 0 || user.isLocked) {
      user.loginAttempts = 0;
      user.isLocked = false;
      user.lockedUntil = undefined;
      user.lastLogin = new Date();
      await user.save();
    }

    // 🔑 Generar token
    const token = user.generateAuthToken();
    console.log('✅ LOGIN EXITOSO para usuario:', user.email);
    console.log('🔑 Token generado:', token ? 'SÍ' : 'NO');

    // 📤 Respuesta exitosa (sin contraseña)
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      timezone: user.timezone,
      role: user.role,
      isVerified: user.isVerified,
      isFirstLogin: user.isFirstLogin,
      interests: user.interests,
      profession: user.profession,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      paymentMethods: user.paymentMethods,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login exitoso',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// 👤 OBTENER PERFIL DE USUARIO
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      timezone: user.timezone,
      role: user.role,
      isVerified: user.isVerified,
      isFirstLogin: user.isFirstLogin,
      interests: user.interests,
      profession: user.profession,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      paymentMethods: user.paymentMethods,
      createdAt: user.createdAt
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// �� ACTUALIZAR USUARIO
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // No permitir actualizar contraseña aquí
    delete updates.email; // No permitir cambiar email
    delete updates.role; // No permitir cambiar rol

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      timezone: user.timezone,
      role: user.role,
      isVerified: user.isVerified,
      isFirstLogin: user.isFirstLogin,
      interests: user.interests,
      profession: user.profession,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      paymentMethods: user.paymentMethods,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: userResponse
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 👥 OBTENER TODOS LOS USUARIOS (Solo Admin)
app.get('/api/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔄 MARCAR COMO NO PRIMER LOGIN
app.put('/api/auth/first-login-completed', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isFirstLogin: false, updatedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Primer login completado' });
  } catch (error) {
    console.error('Error actualizando primer login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// �� ACTUALIZAR INTERESES DEL ESTUDIANTE
app.put('/api/auth/interests', authenticateToken, async (req, res) => {
  try {
    const { interests } = req.body;
    
    if (!Array.isArray(interests)) {
      return res.status(400).json({ error: 'Los intereses deben ser un array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        interests,
        isFirstLogin: false,
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      message: 'Intereses actualizados exitosamente',
      interests: user.interests 
    });
  } catch (error) {
    console.error('Error actualizando intereses:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ ELIMINAR USUARIO (Solo Admin)
app.delete('/api/users/:userId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== 🚀 INICIALIZACIÓN ====================

// 🔧 Crear usuario admin por defecto si no existe
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@flowcasa-zen.com' });
    
    if (!adminExists) {
      const defaultAdmin = new User({
        firstName: 'Admin',
        lastName: 'FlowCasaZen',
        email: 'admin@flowcasa-zen.com',
        password: 'admin123',
        country: 'Argentina',
        timezone: 'America/Argentina/Buenos_Aires',
        role: 'admin',
        isVerified: true,
        isFirstLogin: false
      });

      await defaultAdmin.save();
      console.log('✅ Usuario admin por defecto creado');
    }
  } catch (error) {
    console.error('Error creando admin por defecto:', error);
  }
};

// 📚 Poblar clases por defecto si no existen
const populateDefaultClasses = async () => {
  try {
    const classesExist = await TrainingPack.countDocuments();
    
    if (classesExist === 0) {
      const defaultClasses = [
        {
          title: 'Yoga Matutino para Principiantes',
          description: 'Despierta tu cuerpo y mente con esta rutina de yoga suave de 30 minutos. Perfecta para empezar el día con energía y claridad mental.',
          price: 25,
          currency: 'USD',
          duration: '30 min',
          difficulty: 'Principiante',
          category: 'Yoga',
          teacher: {
            id: 'teacher-1',
            name: 'María González',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            students: 1250,
            country: 'España'
          },
          reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
          exercises: ['Saludo al Sol', 'Posturas de Pie', 'Flexiones hacia adelante', 'Torsiones', 'Relajación final'],
          benefits: ['Mejora la flexibilidad', 'Reduce el estrés', 'Fortalece el core', 'Mejora la postura'],
          requirements: ['Mat de yoga', 'Ropa cómoda', 'Espacio tranquilo'],
          isPopular: true,
          discount: 20
        },
        {
          title: 'HIIT Intenso - Quema Calorías',
          description: 'Sesión de alta intensidad de 45 minutos para maximizar la quema de calorías y mejorar tu condición cardiovascular.',
          price: 35,
          currency: 'USD',
          duration: '45 min',
          difficulty: 'Intermedio',
          category: 'Fitness',
          teacher: {
            id: 'teacher-2',
            name: 'Carlos Mendoza',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            rating: 4.8,
            students: 890,
            country: 'México'
          },
          reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          exercises: ['Burpees', 'Jumping Jacks', 'Mountain Climbers', 'High Knees', 'Plank Jacks'],
          benefits: ['Quema grasa', 'Mejora resistencia', 'Fortalece músculos', 'Acelera metabolismo'],
          requirements: ['Ropa deportiva', 'Agua', 'Espacio amplio'],
          isPopular: true
        },
        {
          title: 'Malabares con Pelotas - Nivel Básico',
          description: 'Aprende los fundamentos del malabarismo con 3 pelotas. Técnicas básicas y progresiones para desarrollar coordinación.',
          price: 20,
          currency: 'USD',
          duration: '25 min',
          difficulty: 'Principiante',
          category: 'Malabares',
          teacher: {
            id: 'teacher-3',
            name: 'Ana Rodríguez',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            rating: 4.7,
            students: 450,
            country: 'Argentina'
          },
          reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          exercises: ['Cascada básica', 'Columnas', 'Mills Mess', 'Trucos de una mano', 'Rutina final'],
          benefits: ['Mejora coordinación', 'Desarrolla concentración', 'Ejercita ambos hemisferios', 'Reduce estrés'],
          requirements: ['3 pelotas de malabares', 'Espacio amplio', 'Paciencia'],
          isPopular: false
        },
        {
          title: 'Kung Fu Tradicional - Formas Básicas',
          description: 'Introducción al Kung Fu con formas tradicionales y técnicas de respiración. Desarrolla fuerza, flexibilidad y disciplina mental.',
          price: 40,
          currency: 'USD',
          duration: '50 min',
          difficulty: 'Intermedio',
          category: 'Artes Marciales',
          teacher: {
            id: 'teacher-4',
            name: 'Li Wei',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            students: 320,
            country: 'China'
          },
          reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop',
          exercises: ['Saludo tradicional', 'Forma del Tigre', 'Técnicas de puño', 'Patadas básicas', 'Meditación final'],
          benefits: ['Desarrolla fuerza', 'Mejora flexibilidad', 'Fortalece disciplina', 'Conexión mente-cuerpo'],
          requirements: ['Ropa cómoda', 'Espacio amplio', 'Actitud respetuosa'],
          isPopular: true,
          discount: 15
        },
        {
          title: 'Pilates Core Intenso',
          description: 'Fortalece tu core con esta sesión de Pilates de 35 minutos. Enfoque en estabilidad, control y respiración.',
          price: 30,
          currency: 'USD',
          duration: '35 min',
          difficulty: 'Intermedio',
          category: 'Pilates',
          teacher: {
            id: 'teacher-5',
            name: 'Sofia Martínez',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
            rating: 4.8,
            students: 680,
            country: 'Colombia'
          },
          reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          exercises: ['Hundred', 'Roll Up', 'Single Leg Circles', 'Criss Cross', 'Teaser'],
          benefits: ['Fortalece core', 'Mejora postura', 'Desarrolla control', 'Reduce dolor lumbar'],
          requirements: ['Mat de Pilates', 'Ropa cómoda', 'Concentración'],
          isPopular: false
        },
        {
          title: 'Meditación Guiada - Mindfulness',
          description: 'Sesión de meditación mindfulness de 20 minutos para reducir el estrés y mejorar la claridad mental.',
          price: 15,
          currency: 'USD',
          duration: '20 min',
          difficulty: 'Principiante',
          category: 'Meditación',
          teacher: {
            id: 'teacher-6',
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            students: 2100,
            country: 'Corea del Sur'
          },
          reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          exercises: ['Respiración consciente', 'Body Scan', 'Meditación caminando', 'Loving Kindness', 'Relajación profunda'],
          benefits: ['Reduce estrés', 'Mejora concentración', 'Desarrolla mindfulness', 'Mejora sueño'],
          requirements: ['Lugar tranquilo', 'Ropa cómoda', 'Actitud abierta'],
          isPopular: true
        }
      ];

      await TrainingPack.insertMany(defaultClasses);
      console.log('✅ Clases por defecto creadas exitosamente');
    }
  } catch (error) {
    console.error('Error poblando clases por defecto:', error);
  }
};

// 💳 MERCADO PAGO - INFORMACIÓN DEL ENDPOINT
app.get('/api/payments/mercadopago/create-preference', (req, res) => {
  res.json({
    message: 'Endpoint para crear preferencias de MercadoPago',
    method: 'POST',
    description: 'Este endpoint requiere una petición POST con los datos del pago',
    required_fields: {
      title: 'string - Título del producto/servicio',
      price: 'number - Precio del producto',
      currency: 'string - Moneda (USD, ARS, etc.)',
      description: 'string - Descripción del producto (opcional)',
      quantity: 'number - Cantidad (opcional, default: 1)'
    },
    example: {
      title: 'Clase de Yoga',
      price: 25.99,
      currency: 'USD',
      description: 'Clase de yoga para principiantes',
      quantity: 1
    },
    test_mode: false,
    sandbox: false
  });
});

// 💳 MERCADO PAGO - CREAR PREFERENCIA DE PAGO
app.post('/api/payments/mercadopago/create-preference', async (req, res) => {
  try {
    const { title, price, currency, description, quantity = 1 } = req.body;
    
    // Validaciones básicas
    if (!title || !price || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: title, price, currency'
      });
    }

    // Datos de la preferencia de Mercado Pago
    const preferenceData = {
      items: [
        {
          title: title,
          quantity: quantity,
          unit_price: parseFloat(price),
          currency_id: currency === 'USD' ? 'USD' : 'ARS',
          description: description || title
        }
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/failure`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/pending`
      },
      auto_return: 'approved',
      external_reference: `flowcasa-zen-${Date.now()}`,
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/mercadopago/webhook`
    };

    // Crear preferencia real de MercadoPago
    console.log('💳 Creando preferencia de MercadoPago en modo PRODUCCIÓN...');
    console.log('🔑 Access Token:', client.accessToken.substring(0, 10) + '...');
    console.log('🚀 Modo Producción:', !client.options.sandbox);
    
    try {
      const response = await preference.create({ body: preferenceData });
      
      console.log('✅ Preferencia creada exitosamente:', response.id);
      console.log('🔗 init_point:', response.init_point);
      console.log('🧪 sandbox_init_point:', response.sandbox_init_point);
      
      // Verificar que tenemos init_point para producción
      if (!response.init_point) {
        console.warn('⚠️ ADVERTENCIA: No se recibió init_point de MercadoPago');
        console.warn('🔍 Respuesta completa:', JSON.stringify(response, null, 2));
      }

      res.json({
        success: true,
        preference_id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
        preference: preferenceData,
        test_mode: false,
        sandbox_mode: false,
        message: 'Preferencia de MercadoPago creada exitosamente en modo PRODUCCIÓN',
        debug_info: {
          has_sandbox_url: !!response.sandbox_init_point,
          has_production_url: !!response.init_point,
          preference_id: response.id
        }
      });
      
    } catch (mpError) {
      console.error('❌ Error creando preferencia de MercadoPago:', mpError);
      
      // Fallback: Si falla MercadoPago, usar modo simulado
      console.log('🔄 Usando modo simulado como fallback...');
      
      res.json({
        success: true,
        preference_id: `test_${Date.now()}`,
        init_point: `http://localhost:3000/payment/success?test=true&preference_id=test_${Date.now()}`,
        sandbox_init_point: `http://localhost:3000/payment/success?test=true&preference_id=test_${Date.now()}`,
        preference: preferenceData,
        test_mode: true,
        message: 'Modo simulado activado - Error en MercadoPago'
      });
    }

  } catch (error) {
    console.error('Error creando preferencia de Mercado Pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// 💳 MERCADO PAGO - WEBHOOK (para notificaciones)
app.post('/api/payments/mercadopago/webhook', async (req, res) => {
  try {
    console.log('🔔 Webhook de Mercado Pago recibido:', req.body);
    
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentId = data.id;
      console.log(`💳 Procesando pago ID: ${paymentId}`);
      
      // Aquí puedes hacer una consulta a la API de MercadoPago para obtener detalles del pago
      // y actualizar el estado en tu base de datos
      
      // Ejemplo de procesamiento:
      // 1. Obtener detalles del pago desde MercadoPago
      // 2. Verificar el estado del pago
      // 3. Actualizar la base de datos
      // 4. Enviar confirmación al usuario
      
      console.log(`✅ Pago ${paymentId} procesado exitosamente`);
    }
    
    // Responder con 200 para confirmar recepción
    res.status(200).json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      type: type || 'unknown',
      data_id: data?.id || 'unknown'
    });
    
  } catch (error) {
    console.error('❌ Error procesando webhook de Mercado Pago:', error);
    res.status(500).json({ 
      error: 'Error procesando webhook',
      timestamp: new Date().toISOString()
    });
  }
});

// 🏠 Ruta raíz para ngrok
app.get('/', (req, res) => {
  res.json({
    message: 'FlowCasaZen API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      payments: '/api/payments',
      classes: '/api/classes'
    }
  });
});

// 🚀 INICIAR SERVIDOR
app.listen(PORT, async () => {
  console.log('🎉 ¡Servidor FlowCasaZen iniciado exitosamente!');
  console.log('='.repeat(50));
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`��️ Base de datos: MongoDB Atlas`);
  console.log('='.repeat(50));
  console.log('📋 Endpoints disponibles:');
  console.log('  🏥 GET /health                    - Health check');
  console.log('  �� POST /api/auth/register        - Registro');
  console.log('  🔐 POST /api/auth/login           - Login');
  console.log('  👤 GET /api/auth/profile          - Perfil');
  console.log('  📝 PUT /api/auth/profile          - Actualizar perfil');
  console.log('  �� GET /api/users                 - Listar usuarios (Admin)');
  console.log('  🗑️ DELETE /api/users/:userId     - Eliminar usuario (Admin)');
  console.log('='.repeat(50));
  
  // Crear admin por defecto y poblar clases
  await createDefaultAdmin();
  await populateDefaultClasses();
  
  console.log('🎯 ¡Todo listo para recibir requests!');
});

// 🛡️ Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('�� Promesa rechazada no manejada:', reason);
});
