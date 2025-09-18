import React, { useState, useEffect } from 'react';
import { countries, getTimezonesForCountry, formatTimezone } from '../data/countries';
import { findUserByEmail } from '../utils/userStorage';
import { getCurrentUser } from '../utils/sessionManager';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  timezone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  country?: string;
  timezone?: string;
}

interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
  onGoToLogin?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onComplete, onGoToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    timezone: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔐 VERIFICAR SI YA HAY UNA SESIÓN ACTIVA
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setErrors({
        firstName: `Ya hay una sesión activa con el usuario: ${currentUser.email}. Por favor, cierra sesión antes de registrarte con otro usuario.`
      });
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Mínimo 8 caracteres, al menos una mayúscula y un número
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    } else if (await findUserByEmail(formData.email)) {
      newErrors.email = 'Este email ya está registrado. Usa otro email o inicia sesión.';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar país
    if (!formData.country) {
      newErrors.country = 'Selecciona tu país';
    }

    // Validar zona horaria
    if (!formData.timezone) {
      newErrors.timezone = 'Selecciona tu zona horaria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Si cambia el país, resetear la zona horaria
    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        country: value,
        timezone: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔐 VERIFICAR SI YA HAY UNA SESIÓN ACTIVA
    const currentUser = getCurrentUser();
    if (currentUser) {
      setErrors({
        firstName: `Ya hay una sesión activa con el usuario: ${currentUser.email}. Por favor, cierra sesión antes de registrarte con otro usuario.`
      });
      return;
    }
    
    if (!(await validateForm())) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Llamar a la función de completado
      onComplete(formData);
      
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un error en el registro. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTimezones = formData.country ? getTimezonesForCountry(formData.country) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">FlowCasaZen</h1>
          <p className="text-sage-600">Únete a nuestra comunidad de yoga</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-sage-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                  errors.firstName ? 'border-red-500' : 'border-sage-300'
                }`}
                placeholder="Tu nombre"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-sage-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                  errors.lastName ? 'border-red-500' : 'border-sage-300'
                }`}
                placeholder="Tu apellido"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-sage-300'
              }`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.password ? 'border-red-500' : 'border-sage-300'
              }`}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-sage-700 mb-2">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.confirmPassword ? 'border-red-500' : 'border-sage-300'
              }`}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* País */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-sage-700 mb-2">
              País *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.country ? 'border-red-500' : 'border-sage-300'
              }`}
            >
              <option value="">Selecciona tu país</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* Zona Horaria */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-sage-700 mb-2">
              Zona Horaria *
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              disabled={!formData.country}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.timezone ? 'border-red-500' : 'border-sage-300'
              } ${!formData.country ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">
                {formData.country ? 'Selecciona tu zona horaria' : 'Primero selecciona un país'}
              </option>
              {availableTimezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {formatTimezone(timezone)}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-zen-600 hover:bg-zen-700 focus:ring-2 focus:ring-zen-500 focus:ring-offset-2'
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Continuar / Registrarme'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-sage-600">
            ¿Ya tienes cuenta?{' '}
            <button 
              type="button"
              className="text-zen-600 hover:text-zen-700 font-medium bg-transparent border-none cursor-pointer underline"
              onClick={onGoToLogin}
            >
              Inicia sesión
            </button>
          </p>
        </div>
        
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
      </div>
    </div>
  );
};

export default RegistrationForm;