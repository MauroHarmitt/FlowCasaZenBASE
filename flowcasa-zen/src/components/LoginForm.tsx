import React, { useState, useEffect } from 'react';
import { verifyCredentials } from '../utils/userStorage';
import { getCurrentUser } from '../utils/sessionManager';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
  onGoToRegister: () => void;
  onGoToAdminLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onGoToRegister, onGoToAdminLogin }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string>('');
  const [attemptsCount, setAttemptsCount] = useState(0);

  // 🔐 VERIFICAR SI YA HAY UNA SESIÓN ACTIVA
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setErrors({
        general: `Ya hay una sesión activa con el usuario: ${currentUser.email}. Por favor, cierra sesión antes de iniciar sesión con otro usuario.`
      });
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido. Ejemplo: usuario@ejemplo.com';
    } else if (formData.email.length > 254) {
      newErrors.email = 'El email es demasiado largo';
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (formData.password.length > 128) {
      newErrors.password = 'La contraseña es demasiado larga';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validación en tiempo real
    if (name === 'email' && value.trim()) {
      if (!validateEmail(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'El formato del email no es válido'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: undefined
        }));
      }
    } else if (name === 'password' && value) {
      if (value.length < 6) {
        setErrors(prev => ({
          ...prev,
          password: 'La contraseña debe tener al menos 6 caracteres'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          password: undefined
        }));
      }
    } else {
      // Limpiar errores si el campo está vacío o es válido
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Limpiar error general si hay cambios
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔒 VERIFICAR SI EL FORMULARIO ESTÁ BLOQUEADO
    if (isBlocked) {
      setErrors({
        general: `Formulario bloqueado: ${blockReason}`
      });
      return;
    }
    
    // 🔐 VERIFICAR SI YA HAY UNA SESIÓN ACTIVA
    const currentUser = getCurrentUser();
    if (currentUser) {
      setErrors({
        general: `Ya hay una sesión activa con el usuario: ${currentUser.email}. Por favor, cierra sesión antes de iniciar sesión con otro usuario.`
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      console.log('🔐 Intentando login con:', formData.email);
      
      // 🔒 VERIFICACIÓN CRÍTICA: Verificar que el servidor esté disponible
      try {
        const healthCheck = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/health`);
        if (!healthCheck.ok) {
          throw new Error('Servidor no disponible');
        }
        console.log('✅ Servidor disponible, procediendo con login');
      } catch (serverError) {
        console.error('❌ Servidor no disponible:', serverError);
        setErrors({
          general: 'El servidor no está disponible. Verifica tu conexión e inténtalo de nuevo.'
        });
        return;
      }
      
      // Verificar credenciales contra la base de datos
      const user = await verifyCredentials(formData.email, formData.password);
      
      // ✅ VERIFICACIÓN ESTRICTA: Solo permitir acceso si el usuario es válido y tiene ID
      if (user && user.id && user.email && user.role) {
        // Login exitoso - credenciales verificadas correctamente
        console.log('✅ Login exitoso para:', user.email);
        console.log('👤 Datos del usuario:', user);
        console.log('🔒 Verificación de seguridad: PASÓ');
        
        // ✅ LOGIN EXITOSO - RESETEAR CONTADOR DE INTENTOS
        setAttemptsCount(0);
        setIsBlocked(false);
        setBlockReason('');
        
        // Usar directamente el objeto user que ya tiene todos los campos correctos
        onLoginSuccess(user);
      } else {
        // ❌ CREDENCIALES INCORRECTAS - NO PERMITIR ACCESO
        console.log('❌ Login fallido - credenciales inválidas o usuario no válido');
        console.log('🔒 Verificación de seguridad: FALLÓ');
        console.log('📋 Datos recibidos:', user);
        
        // 🔒 INCREMENTAR CONTADOR DE INTENTOS FALLIDOS
        const newAttemptsCount = attemptsCount + 1;
        setAttemptsCount(newAttemptsCount);
        
        // 🔒 BLOQUEAR DESPUÉS DE 3 INTENTOS FALLIDOS
        if (newAttemptsCount >= 3) {
          setIsBlocked(true);
          setBlockReason('Demasiados intentos fallidos. Espera 5 minutos antes de intentar nuevamente.');
          setErrors({
            general: 'Demasiados intentos fallidos. El formulario ha sido bloqueado por 5 minutos por seguridad.'
          });
          
          // 🔒 DESBLOQUEAR DESPUÉS DE 5 MINUTOS
          setTimeout(() => {
            setIsBlocked(false);
            setBlockReason('');
            setAttemptsCount(0);
            setErrors({});
            console.log('🔓 Formulario desbloqueado automáticamente');
          }, 5 * 60 * 1000); // 5 minutos
          
          return;
        }
        
        setErrors({
          general: `Credenciales incorrectas. Te quedan ${3 - newAttemptsCount} intentos antes del bloqueo. Serás redirigido automáticamente al registro en 2 segundos...`
        });
        
        // 🔄 REDIRIGIR AUTOMÁTICAMENTE AL REGISTRO DESPUÉS DE 2 SEGUNDOS
        setTimeout(() => {
          console.log('🔄 Redirigiendo automáticamente al registro...');
          onGoToRegister();
        }, 2000);
        
        return; // IMPORTANTE: Salir sin permitir acceso
      }
      
    } catch (error: any) {
      console.error('❌ Error en el login:', error);
      
      // 🔒 INCREMENTAR CONTADOR DE INTENTOS FALLIDOS EN ERRORES
      const newAttemptsCount = attemptsCount + 1;
      setAttemptsCount(newAttemptsCount);
      
      // 🔒 BLOQUEAR DESPUÉS DE 3 INTENTOS FALLIDOS
      if (newAttemptsCount >= 3) {
        setIsBlocked(true);
        setBlockReason('Demasiados intentos fallidos. Espera 5 minutos antes de intentar nuevamente.');
        setErrors({
          general: 'Demasiados intentos fallidos. El formulario ha sido bloqueado por 5 minutos por seguridad.'
        });
        
        // 🔒 DESBLOQUEAR DESPUÉS DE 5 MINUTOS
        setTimeout(() => {
          setIsBlocked(false);
          setBlockReason('');
          setAttemptsCount(0);
          setErrors({});
          console.log('🔓 Formulario desbloqueado automáticamente');
        }, 5 * 60 * 1000); // 5 minutos
        
        return;
      }
      
      // Manejar diferentes tipos de errores con mensajes específicos
      if (error.message) {
        if (error.message.includes('No existe una cuenta con este email')) {
          setErrors({
            general: `No existe una cuenta con este email. Serás redirigido automáticamente al registro en 2 segundos...`,
            email: 'No existe una cuenta con este email'
          });
          
          // 🔄 REDIRIGIR AUTOMÁTICAMENTE AL REGISTRO DESPUÉS DE 2 SEGUNDOS
          setTimeout(() => {
            console.log('🔄 Usuario no existe, redirigiendo al registro...');
            onGoToRegister();
          }, 2000);
        } else if (error.message.includes('La contraseña es incorrecta')) {
          setErrors({
            general: `La contraseña es incorrecta. Serás redirigido automáticamente al registro en 2 segundos...`,
            password: 'Contraseña incorrecta'
          });
          
          // 🔄 REDIRIGIR AUTOMÁTICAMENTE AL REGISTRO DESPUÉS DE 2 SEGUNDOS
          setTimeout(() => {
            console.log('🔄 Contraseña incorrecta, redirigiendo al registro...');
            onGoToRegister();
          }, 2000);
        } else if (error.message.includes('El formato del email no es válido')) {
          setErrors({
            general: 'El formato del email no es válido. Verifica que el email tenga el formato correcto.',
            email: 'Formato de email inválido'
          });
        } else if (error.message.includes('Email y contraseña son requeridos')) {
          setErrors({
            general: 'Por favor, completa todos los campos requeridos.',
            email: formData.email ? undefined : 'El email es requerido',
            password: formData.password ? undefined : 'La contraseña es requerida'
          });
        } else if (error.message.includes('Credenciales inválidas')) {
          setErrors({
            general: `Credenciales incorrectas. Te quedan ${3 - newAttemptsCount} intentos antes del bloqueo. Verifica tu email y contraseña, o regístrate si no tienes cuenta.`
          });
        } else if (error.message.includes('Cuenta bloqueada temporalmente')) {
          setErrors({
            general: error.message
          });
        } else if (error.message.includes('Te quedan')) {
          setErrors({
            general: error.message,
            password: 'Contraseña incorrecta'
          });
        } else if (error.message.includes('El servidor no está disponible')) {
          setErrors({
            general: 'El servidor no está disponible. Verifica tu conexión e inténtalo de nuevo.'
          });
        } else {
          setErrors({
            general: `Error de conexión. Te quedan ${3 - newAttemptsCount} intentos antes del bloqueo. Verifica que el servidor esté funcionando e inténtalo de nuevo.`
          });
        }
      } else {
        setErrors({
          general: `Error inesperado. Te quedan ${3 - newAttemptsCount} intentos antes del bloqueo. Por favor, inténtalo de nuevo.`
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">FlowCasaZen</h1>
          <p className="text-sage-600">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error general */}
          {errors.general && (
            <div className={`border rounded-lg p-4 ${
              isBlocked 
                ? 'bg-red-100 border-red-300' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                isBlocked 
                  ? 'text-red-800 font-semibold' 
                  : 'text-red-700'
              }`}>
                {errors.general}
              </p>
              {isBlocked && (
                <p className="text-red-600 text-xs mt-2">
                  🔒 Formulario bloqueado por seguridad
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isBlocked}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-sage-300'
              } ${isBlocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isBlocked}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.password ? 'border-red-500' : 'border-sage-300'
              } ${isBlocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Tu contraseña"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Recordar sesión y olvidé contraseña */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-zen-600 border-sage-300 rounded focus:ring-zen-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-sage-600">
                Recordar sesión
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-zen-600 hover:text-zen-700 font-medium"
              onClick={() => console.log('Recuperar contraseña')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting || isBlocked}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting || isBlocked
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-zen-600 hover:bg-zen-700 focus:ring-2 focus:ring-zen-500 focus:ring-offset-2'
            } text-white`}
          >
            {isBlocked ? (
              '🔒 Formulario bloqueado'
            ) : isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {/* Enlace a registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-sage-600">
            ¿No tienes cuenta?{' '}
            <button 
              type="button"
              className="text-zen-600 hover:text-zen-700 font-medium bg-transparent border-none cursor-pointer underline"
              onClick={onGoToRegister}
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        {/* Enlace al panel de administración */}
        {onGoToAdminLogin && (
          <div className="mt-4 text-center">
            <button 
              type="button"
              className="text-sm text-red-600 hover:text-red-700 font-medium bg-transparent border-none cursor-pointer underline"
              onClick={onGoToAdminLogin}
            >
              🔒 Acceso para Administradores
            </button>
          </div>
        )}
        
        {/* 🏠 BOTÓN VOLVER AL HOME */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Volver al Home</span>
          </button>
        </div>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sage-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-sage-500">O continúa con</span>
            </div>
          </div>
        </div>

        {/* Botones de login social */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-sage-300 rounded-lg shadow-sm bg-white text-sm font-medium text-sage-700 hover:bg-sage-50 transition-colors"
            onClick={() => console.log('Login con Google')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="ml-2">Google</span>
          </button>

          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-sage-300 rounded-lg shadow-sm bg-white text-sm font-medium text-sage-700 hover:bg-sage-50 transition-colors"
            onClick={() => console.log('Login con Facebook')}
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="ml-2">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;