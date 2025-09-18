// 🔄 MIGRACIÓN A API BACKEND
// Este archivo ahora actúa como adaptador para la API

import { 
  registerUser, 
  loginUser, 
  updateUserProfile,
  getAllUsers,
  markFirstLoginCompleted,
  updateStudentInterests,
  saveUserSession,
  getCurrentUser,
  clearUserSession,
  isAuthenticated,
  UserData,
  LoginResponse,
  RegisterResponse
} from '../services/api';

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

// ==================== FUNCIONES ADAPTADAS ====================

export const getUsers = async (): Promise<UserDataLegacy[]> => {
  try {
    const response = await getAllUsers();
    return response.users.map(convertToLegacyFormat);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

export const saveUser = async (userData: Omit<UserDataLegacy, 'id' | 'createdAt'>): Promise<UserDataLegacy> => {
  try {
    const response: RegisterResponse = await registerUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      country: userData.country,
      timezone: userData.timezone,
      role: userData.role === 'admin' ? 'student' : userData.role,
      profession: userData.profession,
      documentType: userData.documentType,
      documentNumber: userData.documentNumber,
      paymentMethods: userData.paymentMethods
    });

    saveUserSession(response.user, response.token);
    return convertToLegacyFormat(response.user);
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    throw error;
  }
};

export const findUserByEmail = async (email: string): Promise<UserDataLegacy | null> => {
  try {
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

// 🔄 CAMBIO PRINCIPAL: verifyCredentials ahora lanza errores si algo falla
export const verifyCredentials = async (email: string, password: string): Promise<UserDataLegacy | null> => {
  try {
    console.log('🔍 Verificando credenciales para:', email);
    const response: LoginResponse = await loginUser(email, password);

    if (!response || !response.user || !response.token) {
      console.log('❌ Respuesta inválida del servidor');
      throw new Error('Respuesta inválida del servidor');
    }

    if (!response.user.id || !response.user.email) {
      console.log('❌ Datos de usuario inválidos en la respuesta');
      throw new Error('Datos de usuario inválidos');
    }

    saveUserSession(response.user, response.token);
    console.log('✅ Credenciales verificadas exitosamente');
    return convertToLegacyFormat(response.user);

  } catch (error: any) {
    console.error('❌ Error al verificar credenciales:', error);
    if (error.message) throw new Error(error.message);
    throw new Error('Error de conexión con el servidor');
  }
};

export const updateUser = async (userId: string, updates: Partial<UserDataLegacy>): Promise<UserDataLegacy | null> => {
  try {
    const apiUpdates: any = { ...updates };
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

export const markAsNotFirstLogin = async (userId: string): Promise<void> => {
  try {
    await markFirstLoginCompleted();
  } catch (error) {
    console.error('Error al marcar como no primer login:', error);
  }
};

export const updateStudentInterestsLegacy = async (userId: string, interests: string[]): Promise<void> => {
  try {
    await updateStudentInterests(interests);
  } catch (error) {
    console.error('Error al actualizar intereses:', error);
  }
};

// ==================== FUNCIONES DE SESIÓN ====================
export { saveUserSession, getCurrentUser, clearUserSession };
export const isUserLoggedIn = (): boolean => isAuthenticated();

// ==================== UTILIDADES ====================
const convertToLegacyFormat = (apiUser: UserData): UserDataLegacy => ({
  id: apiUser.id,
  firstName: apiUser.firstName,
  lastName: apiUser.lastName,
  email: apiUser.email,
  password: '',
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
});

// ==================== INICIALIZACIÓN ====================
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

checkServerHealth().then(isHealthy => {
  if (!isHealthy) {
    console.warn('⚠️ Servidor backend no disponible. Algunas funciones pueden no funcionar correctamente.');
    console.warn('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:5000');
  } else {
    console.log('✅ Servidor backend conectado exitosamente');
  }
});
