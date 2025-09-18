// 🔐 GESTOR DE SESIÓN AVANZADO - FlowCasaZen
// Maneja la persistencia de sesión con cookies y renovación automática

import { UserData } from '../services/api';

// 🍪 CONFIGURACIÓN DE COOKIES
const COOKIE_CONFIG = {
  SESSION_COOKIE: 'flowcasa-zen-session',
  TOKEN_COOKIE: 'flowcasa-zen-token',
  REFRESH_COOKIE: 'flowcasa-zen-refresh',
  EXPIRES_DAYS: 30, // 30 días de persistencia
  SECURE: process.env.NODE_ENV === 'production', // HTTPS en producción
  SAME_SITE: 'Lax' as const,
};

// ⏰ CONFIGURACIÓN DE RENOVACIÓN
const RENEWAL_CONFIG = {
  CHECK_INTERVAL: 5 * 60 * 1000, // Verificar cada 5 minutos
  RENEW_BEFORE_EXPIRY: 10 * 60 * 1000, // Renovar 10 minutos antes de expirar
  MAX_RETRIES: 3,
};

// 🔧 UTILIDADES DE COOKIES
export const cookieUtils = {
  // Establecer cookie
  set: (name: string, value: string, days: number = COOKIE_CONFIG.EXPIRES_DAYS) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=${COOKIE_CONFIG.SAME_SITE}${
      COOKIE_CONFIG.SECURE ? ';Secure' : ''
    }`;
    
    document.cookie = cookieString;
  },

  // Obtener cookie
  get: (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Eliminar cookie
  remove: (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  // Verificar si las cookies están habilitadas
  isEnabled: (): boolean => {
    try {
      const testCookie = 'test-cookie';
      cookieUtils.set(testCookie, 'test');
      const exists = cookieUtils.get(testCookie) !== null;
      cookieUtils.remove(testCookie);
      return exists;
    } catch {
      return false;
    }
  }
};

// 🔄 INTERFAZ DE SESIÓN
interface SessionData {
  user: UserData;
  token: string;
  refreshToken: string;
  expiresAt: string;
  lastActivity: string;
  isActive: boolean;
}

// 🎯 CLASE GESTOR DE SESIÓN
class SessionManager {
  private renewalTimer: NodeJS.Timeout | null = null;
  private isRenewing = false;

  constructor() {
    this.startRenewalCheck();
    this.setupActivityTracking();
  }

  // 💾 GUARDAR SESIÓN COMPLETA
  saveSession(sessionData: SessionData): void {
    try {
      // Guardar en localStorage como respaldo
      localStorage.setItem('flowcasa-zen-session', JSON.stringify(sessionData));
      localStorage.setItem('flowcasa-zen-token', sessionData.token);
      
      // Guardar en cookies para persistencia
      if (cookieUtils.isEnabled()) {
        cookieUtils.set(COOKIE_CONFIG.SESSION_COOKIE, JSON.stringify(sessionData));
        cookieUtils.set(COOKIE_CONFIG.TOKEN_COOKIE, sessionData.token);
        cookieUtils.set(COOKIE_CONFIG.REFRESH_COOKIE, sessionData.refreshToken);
      }
      
      console.log('✅ Sesión guardada exitosamente');
    } catch (error) {
      console.error('❌ Error guardando sesión:', error);
    }
  }

  // 📖 OBTENER SESIÓN ACTUAL
  getSession(): SessionData | null {
    try {
      // Intentar obtener de cookies primero
      let sessionData: SessionData | null = null;
      
      if (cookieUtils.isEnabled()) {
        const cookieSession = cookieUtils.get(COOKIE_CONFIG.SESSION_COOKIE);
        if (cookieSession) {
          sessionData = JSON.parse(cookieSession);
        }
      }
      
      // Fallback a localStorage
      if (!sessionData) {
        const localSession = localStorage.getItem('flowcasa-zen-session');
        if (localSession) {
          sessionData = JSON.parse(localSession);
        }
      }
      
      if (!sessionData) return null;
      
      // Verificar si la sesión ha expirado
      if (new Date() > new Date(sessionData.expiresAt)) {
        console.log('⏰ Sesión expirada, limpiando...');
        this.clearSession();
        return null;
      }
      
      // Actualizar última actividad
      sessionData.lastActivity = new Date().toISOString();
      this.saveSession(sessionData);
      
      return sessionData;
    } catch (error) {
      console.error('❌ Error obteniendo sesión:', error);
      this.clearSession();
      return null;
    }
  }

  // 👤 OBTENER USUARIO ACTUAL
  getCurrentUser(): UserData | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

  // 🔑 OBTENER TOKEN ACTUAL
  getCurrentToken(): string | null {
    const session = this.getSession();
    return session ? session.token : null;
  }

  // 🧹 LIMPIAR SESIÓN COMPLETA
  clearSession(): void {
    try {
      console.log('🧹 Iniciando limpieza de sesión...');
      
      // Limpiar localStorage
      localStorage.removeItem('flowcasa-zen-session');
      localStorage.removeItem('flowcasa-zen-token');
      localStorage.removeItem('flowcasa-zen-refresh');
      
      // Limpiar cookies usando múltiples métodos
      const cookiesToRemove = [
        'flowcasa-zen-session',
        'flowcasa-zen-token', 
        'flowcasa-zen-refresh'
      ];
      
      cookiesToRemove.forEach(cookieName => {
        // Método 1: Usar cookieUtils
        cookieUtils.remove(cookieName);
        
        // Método 2: Limpiar manualmente con diferentes paths
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
      });
      
      // Limpiar timer de renovación
      if (this.renewalTimer) {
        clearInterval(this.renewalTimer);
        this.renewalTimer = null;
      }
      
      // Limpiar cualquier referencia en memoria
      this.isRenewing = false;
      
      console.log('✅ Sesión limpiada exitosamente');
    } catch (error) {
      console.error('❌ Error limpiando sesión:', error);
    }
  }

  // 🔄 RENOVAR TOKEN AUTOMÁTICAMENTE
  private async renewToken(): Promise<boolean> {
    if (this.isRenewing) return false;
    
    try {
      this.isRenewing = true;
      const session = this.getSession();
      
      if (!session) {
        console.log('❌ No hay sesión para renovar');
        return false;
      }
      
      // Verificar si necesita renovación
      const expiresAt = new Date(session.expiresAt);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeUntilExpiry > RENEWAL_CONFIG.RENEW_BEFORE_EXPIRY) {
        console.log('✅ Token aún válido, no necesita renovación');
        return true;
      }
      
      console.log('🔄 Renovando token...');
      
      // Llamar al endpoint de renovación
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.refreshToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error renovando token');
      }
      
      const data = await response.json();
      
      // Actualizar sesión con nuevo token
      const updatedSession: SessionData = {
        ...session,
        token: data.token,
        refreshToken: data.refreshToken || session.refreshToken,
        expiresAt: data.expiresAt,
        lastActivity: new Date().toISOString(),
      };
      
      this.saveSession(updatedSession);
      console.log('✅ Token renovado exitosamente');
      
      return true;
    } catch (error) {
      console.error('❌ Error renovando token:', error);
      this.clearSession();
      return false;
    } finally {
      this.isRenewing = false;
    }
  }

  // ⏰ INICIAR VERIFICACIÓN DE RENOVACIÓN
  private startRenewalCheck(): void {
    if (this.renewalTimer) {
      clearInterval(this.renewalTimer);
    }
    
    this.renewalTimer = setInterval(async () => {
      const session = this.getSession();
      if (session) {
        await this.renewToken();
      }
    }, RENEWAL_CONFIG.CHECK_INTERVAL);
    
    console.log('⏰ Verificación de renovación iniciada');
  }

  // 🎯 CONFIGURAR SEGUIMIENTO DE ACTIVIDAD
  private setupActivityTracking(): void {
    // Actualizar actividad en eventos del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      const session = this.getSession();
      if (session) {
        session.lastActivity = new Date().toISOString();
        this.saveSession(session);
      }
    };
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
    
    console.log('🎯 Seguimiento de actividad configurado');
  }

  // 📊 OBTENER ESTADO DE LA SESIÓN
  getSessionStatus(): {
    isActive: boolean;
    user: UserData | null;
    expiresAt: string | null;
    timeUntilExpiry: number | null;
  } {
    const session = this.getSession();
    
    if (!session) {
      return {
        isActive: false,
        user: null,
        expiresAt: null,
        timeUntilExpiry: null,
      };
    }
    
    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    
    return {
      isActive: timeUntilExpiry > 0,
      user: session.user,
      expiresAt: session.expiresAt,
      timeUntilExpiry: Math.max(0, timeUntilExpiry),
    };
  }
}

// 🌟 INSTANCIA SINGLETON
export const sessionManager = new SessionManager();

// 🔧 FUNCIONES DE CONVENIENCIA
export const saveSession = (sessionData: SessionData) => sessionManager.saveSession(sessionData);
export const getCurrentUser = () => sessionManager.getCurrentUser();
export const getCurrentToken = () => sessionManager.getCurrentToken();
export const clearSession = () => sessionManager.clearSession();
export const getSessionStatus = () => sessionManager.getSessionStatus();

// 🚀 INICIALIZACIÓN AUTOMÁTICA
export const initializeSession = () => {
  console.log('🚀 Inicializando gestor de sesión...');
  
  // Verificar estado inicial
  const status = getSessionStatus();
  if (status.isActive) {
    console.log('✅ Sesión activa encontrada:', status.user?.email);
  } else {
    console.log('ℹ️ No hay sesión activa');
  }
  
  return status;
};
