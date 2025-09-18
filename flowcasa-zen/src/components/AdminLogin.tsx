import React, { useState } from 'react';
import { verifyCredentials } from '../utils/userStorage';

interface AdminLoginData {
  email: string;
  password: string;
}

interface AdminLoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
  onGoToUserLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onGoToUserLogin }) => {
  const [formData, setFormData] = useState<AdminLoginData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<AdminLoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string>('');
  const [attemptsCount, setAttemptsCount] = useState(0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: AdminLoginErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
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

    if (errors[name as keyof AdminLoginErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setErrors({
        general: `Formulario bloqueado: ${blockReason}`
      });
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // 🔒 Verificar que el servidor esté disponible antes del login
      try {
        const healthCheck = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/health`);
        if (!healthCheck.ok) throw new Error('Servidor no disponible');
        console.log('✅ Servidor disponible, procediendo con login de admin');
      } catch (serverError) {
        console.error('❌ Servidor no disponible:', serverError);
        setErrors({ general: 'El servidor no está disponible. Verifica tu conexión e inténtalo de nuevo.' });
        return;
      }
      
      // 🔄 CAMBIO: verifyCredentials ahora puede lanzar errores
      let user = null;
      try {
        user = await verifyCredentials(formData.email, formData.password);
      } catch (loginError: any) {
        console.error('❌ Error al verificar credenciales:', loginError);
        setErrors({ general: loginError.message || 'Error de conexión con el servidor.' });
        return;
      }
      
      if (user && user.id && user.email && user.role === 'admin') {
        setAttemptsCount(0);
        setIsBlocked(false);
        setBlockReason('');
        
        console.log('✅ Login de admin exitoso para:', user.email);
        onLoginSuccess(user);
      } else {
        console.log('❌ Login de admin fallido - credenciales inválidas o no es admin');
        const newAttemptsCount = attemptsCount + 1;
        setAttemptsCount(newAttemptsCount);
        
        if (newAttemptsCount >= 3) {
          setIsBlocked(true);
          setBlockReason('Demasiados intentos fallidos. Espera 5 minutos antes de intentar nuevamente.');
          setErrors({ general: 'Demasiados intentos fallidos. El formulario ha sido bloqueado por 5 minutos por seguridad.' });

          setTimeout(() => {
            setIsBlocked(false);
            setBlockReason('');
            setAttemptsCount(0);
            setErrors({});
            console.log('🔓 Formulario de admin desbloqueado automáticamente');
          }, 5 * 60 * 1000);
          return;
        }
        
        setErrors({
          general: `Credenciales de administrador incorrectas. Te quedan ${3 - newAttemptsCount} intentos antes del bloqueo. Verifica tu email y contraseña.`
        });
        return;
      }

    } catch (error) {
      console.error('Error en el login de admin:', error);
      const newAttemptsCount = attemptsCount + 1;
      setAttemptsCount(newAttemptsCount);

      if (newAttemptsCount >= 3) {
        setIsBlocked(true);
        setBlockReason('Demasiados intentos fallidos. Espera 5 minutos antes de intentar nuevamente.');
        setErrors({ general: 'Demasiados intentos fallidos. El formulario ha sido bloqueado por 5 minutos por seguridad.' });

        setTimeout(() => {
          setIsBlocked(false);
          setBlockReason('');
          setAttemptsCount(0);
          setErrors({});
          console.log('🔓 Formulario de admin desbloqueado automáticamente');
        }, 5 * 60 * 1000);
        return;
      }

      setErrors({
        general: `Error de conexión. Te quedan ${3 - newAttemptsCount} intentos antes del bloqueo. Inténtalo de nuevo.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... resto del JSX sin cambios
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      {/* CONTENIDO DEL FORMULARIO */}
    </div>
  );
};

export default AdminLogin;
