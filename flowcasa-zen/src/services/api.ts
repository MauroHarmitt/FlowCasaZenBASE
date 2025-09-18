// 🌐 SERVICIO API PARA CONECTAR CON EL BACKEND
// Reemplaza el localStorage con llamadas al servidor

import axios from 'axios';
import { getCurrentToken, clearSession } from '../utils/sessionManager';

// �� Configuración base de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔑 Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔄 Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.log('🔒 Token expirado, limpiando sesión...');
      clearSession();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// �� INTERFAZ DE USUARIO
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  user: UserData;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: UserData;
  token: string;
}

// ==================== 🚀 FUNCIONES DE LA API ====================

// 🔐 REGISTRO DE USUARIO
export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  role?: 'student' | 'teacher';
  profession?: string;
  documentType?: string;
  documentNumber?: string;
  paymentMethods?: any;
}): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error en el registro');
  }
};

// 🔑 LOGIN DE USUARIO
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error en el login');
  }
};

// 👤 OBTENER PERFIL DE USUARIO
export const getUserProfile = async (): Promise<{ user: UserData }> => {
  try {
    const response = await api.get('/api/auth/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error obteniendo perfil');
  }
};

// 📝 ACTUALIZAR PERFIL DE USUARIO
export const updateUserProfile = async (updates: Partial<UserData>): Promise<{ message: string; user: UserData }> => {
  try {
    const response = await api.put('/api/auth/profile', updates);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error actualizando perfil');
  }
};

// 👥 OBTENER TODOS LOS USUARIOS (Solo Admin)
export const getAllUsers = async (): Promise<{ users: UserData[] }> => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error obteniendo usuarios');
  }
};

// 🔄 MARCAR COMO NO PRIMER LOGIN
export const markFirstLoginCompleted = async (): Promise<{ message: string }> => {
  try {
    const response = await api.put('/api/auth/first-login-completed');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error actualizando primer login');
  }
};

// 🎯 ACTUALIZAR INTERESES DEL ESTUDIANTE
export const updateStudentInterests = async (interests: string[]): Promise<{ message: string; interests: string[] }> => {
  try {
    const response = await api.put('/api/auth/interests', { interests });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error actualizando intereses');
  }
};

// 🗑️ ELIMINAR USUARIO (Solo Admin)
export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error eliminando usuario');
  }
};

// 🏥 HEALTH CHECK
export const healthCheck = async (): Promise<{ status: string; timestamp: string; service: string; database: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error: any) {
    throw new Error('Servidor no disponible');
  }
};

// ==================== 📚 FUNCIONES DE CLASES ====================

// 📚 INTERFAZ DE CLASE
export interface ClassData {
  _id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: 'Yoga' | 'Fitness' | 'Crossfit' | 'Malabares' | 'Artes Marciales' | 'Pilates' | 'Meditación';
  teacher: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    students: number;
    country: string;
  };
  reelUrl: string;
  thumbnail: string;
  exercises: string[];
  benefits: string[];
  requirements: string[];
  isPopular: boolean;
  discount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassesResponse {
  classes: ClassData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ClassResponse {
  class: ClassData;
}

// 🎯 OBTENER TODAS LAS CLASES
export const getClasses = async (params?: {
  category?: string;
  difficulty?: string;
  search?: string;
  sortBy?: string;
  limit?: number;
  page?: number;
}): Promise<ClassesResponse> => {
  try {
    const response = await api.get('/api/classes', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error obteniendo clases');
  }
};

// 🎯 OBTENER UNA CLASE POR ID
export const getClassById = async (id: string): Promise<ClassResponse> => {
  try {
    const response = await api.get(`/api/classes/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error obteniendo clase');
  }
};

// 🎯 CREAR NUEVA CLASE
export const createClass = async (classData: Omit<ClassData, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; class: ClassData }> => {
  try {
    const response = await api.post('/api/classes', classData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error creando clase');
  }
};

// 🎯 ACTUALIZAR CLASE
export const updateClass = async (id: string, updates: Partial<ClassData>): Promise<{ message: string; class: ClassData }> => {
  try {
    const response = await api.put(`/api/classes/${id}`, updates);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error actualizando clase');
  }
};

// 🎯 ELIMINAR CLASE
export const deleteClass = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/api/classes/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error eliminando clase');
  }
};

// ==================== 🛠️ FUNCIONES DE UTILIDAD ====================

// 💾 GUARDAR TOKEN EN LOCALSTORAGE
export const saveToken = (token: string): void => {
  localStorage.setItem('flowcasa-zen-token', token);
};

// 🗑️ ELIMINAR TOKEN DEL LOCALSTORAGE
export const removeToken = (): void => {
  localStorage.removeItem('flowcasa-zen-token');
  localStorage.removeItem('flowcasa-zen-session');
};

// 🔍 OBTENER TOKEN DEL LOCALSTORAGE
export const getToken = (): string | null => {
  return localStorage.getItem('flowcasa-zen-token');
};

// ✅ VERIFICAR SI HAY TOKEN VÁLIDO
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null;
};

// 🔄 GUARDAR SESIÓN DEL USUARIO
export const saveUserSession = (user: UserData, token: string): void => {
  const sessionData = {
    user,
    token,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
  };
  
  localStorage.setItem('flowcasa-zen-session', JSON.stringify(sessionData));
  saveToken(token);
};

// 👤 OBTENER USUARIO ACTUAL DESDE LA SESIÓN
export const getCurrentUser = (): UserData | null => {
  try {
    // Usar el nuevo gestor de sesión
    const { getCurrentUser: getCurrentUserFromManager } = require('../utils/sessionManager');
    return getCurrentUserFromManager();
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
};

// 🧹 LIMPIAR SESIÓN COMPLETA
export const clearUserSession = (): void => {
  removeToken();
};

// ==================== 💳 FUNCIONES DE MERCADO PAGO ====================

// 💳 INTERFAZ DE PREFERENCIA DE PAGO
export interface PaymentPreference {
  title: string;
  price: number;
  currency: string;
  description?: string;
  quantity?: number;
}

export interface PaymentPreferenceResponse {
  success: boolean;
  preference_id: string;
  init_point: string;
  sandbox_init_point?: string;
  preference: any;
  test_mode: boolean;
  sandbox_mode: boolean;
  message: string;
  debug_info: {
    has_sandbox_url: boolean;
    has_production_url: boolean;
    preference_id: string;
  };
}

// 💳 CREAR PREFERENCIA DE PAGO
export const createPaymentPreference = async (paymentData: PaymentPreference): Promise<PaymentPreferenceResponse> => {
  try {
    const response = await api.post('/api/payments/mercadopago/create-preference', paymentData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error creando preferencia de pago');
  }
};

// 💳 OBTENER INFORMACIÓN DEL ENDPOINT DE PAGOS
export const getPaymentInfo = async (): Promise<any> => {
  try {
    const response = await api.get('/api/payments/mercadopago/create-preference');
    return response.data;
  } catch (error: any) {
    throw new Error('Error obteniendo información de pagos');
  }
};

export default api;
