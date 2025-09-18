import React, { useState } from 'react';

interface TeacherFormData {
  // Datos básicos (ya completados)
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  timezone: string;
  
  // Datos específicos de profesor
  profession: string;
  documentType: string;
  documentNumber: string;
  documentFront: File | null;
  documentBack: File | null;
  paymentMethods: {
    cbu: string;
    mercadoPago: string;
    lemon: string;
    stripe: boolean;
  };
  identityVerification: boolean;
}

interface TeacherFormErrors {
  profession?: string;
  documentType?: string;
  documentNumber?: string;
  documentFront?: string;
  documentBack?: string;
  paymentMethods?: string;
  identityVerification?: string;
}

interface TeacherRegistrationFormProps {
  basicData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    timezone: string;
  };
  onComplete: (data: TeacherFormData) => void;
  onBack: () => void;
}

const TeacherRegistrationForm: React.FC<TeacherRegistrationFormProps> = ({ 
  basicData, 
  onComplete, 
  onBack 
}) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    ...basicData,
    profession: '',
    documentType: '',
    documentNumber: '',
    documentFront: null,
    documentBack: null,
    paymentMethods: {
      cbu: '',
      mercadoPago: '',
      lemon: '',
      stripe: false
    },
    identityVerification: false
  });

  const [errors, setErrors] = useState<TeacherFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const professions = [
    'Yoga',
    'Fitness',
    'Crossfit',
    'Malabares',
    'Artes marciales',
    'Pilates',
    'Danza',
    'Meditación',
    'Terapia física',
    'Nutrición deportiva',
    'Entrenamiento personal',
    'Otra'
  ];

  const documentTypes = [
    'DNI',
    'ID',
    'Pasaporte',
    'Cédula',
    'Licencia de conducir'
  ];

  const validateCBU = (cbu: string): boolean => {
    // Validación básica de CBU argentino (22 dígitos)
    return /^\d{22}$/.test(cbu);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: TeacherFormErrors = {};

    if (!formData.profession) {
      newErrors.profession = 'La profesión es requerida';
    }

    if (!formData.documentType) {
      newErrors.documentType = 'El tipo de documento es requerido';
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es requerido';
    }

    if (!formData.documentFront) {
      newErrors.documentFront = 'La foto frontal del documento es requerida';
    }

    if (!formData.documentBack) {
      newErrors.documentBack = 'La foto del reverso del documento es requerida';
    }

    // Validar al menos un método de pago
    const hasPaymentMethod = 
      formData.paymentMethods.cbu.trim() !== '' ||
      formData.paymentMethods.mercadoPago.trim() !== '' ||
      formData.paymentMethods.lemon.trim() !== '' ||
      formData.paymentMethods.stripe;

    if (!hasPaymentMethod) {
      newErrors.paymentMethods = 'Debes seleccionar al menos un método de pago';
    }

    // Validar CBU si se proporciona
    if (formData.paymentMethods.cbu.trim() !== '' && !validateCBU(formData.paymentMethods.cbu)) {
      newErrors.paymentMethods = 'El CBU debe tener exactamente 22 dígitos';
    }

    // Validar email de MercadoPago si se proporciona
    if (formData.paymentMethods.mercadoPago.trim() !== '' && !validateEmail(formData.paymentMethods.mercadoPago)) {
      newErrors.paymentMethods = 'El email de MercadoPago no es válido';
    }

    if (!formData.identityVerification) {
      newErrors.identityVerification = 'Debes confirmar la verificación de identidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('paymentMethods.')) {
      const paymentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        paymentMethods: {
          ...prev.paymentMethods,
          [paymentField]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }

    // Limpiar errores
    if (errors[name as keyof TeacherFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'documentFront' | 'documentBack') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Datos completos del profesor:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(formData);
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un error en el registro. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">FlowCasaZen</h1>
          <p className="text-sage-600">Información adicional para Profesores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profesión / Especialidad */}
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-sage-700 mb-2">
              Profesión / Especialidad *
            </label>
            <select
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                errors.profession ? 'border-red-500' : 'border-sage-300'
              }`}
            >
              <option value="">Selecciona tu profesión</option>
              {professions.map((profession) => (
                <option key={profession} value={profession}>
                  {profession}
                </option>
              ))}
            </select>
            {errors.profession && (
              <p className="text-red-500 text-sm mt-1">{errors.profession}</p>
            )}
          </div>

          {/* Documento de identidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-sage-700 mb-2">
                Tipo de documento *
              </label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                  errors.documentType ? 'border-red-500' : 'border-sage-300'
                }`}
              >
                <option value="">Selecciona tipo</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.documentType && (
                <p className="text-red-500 text-sm mt-1">{errors.documentType}</p>
              )}
            </div>

            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-sage-700 mb-2">
                Número de documento *
              </label>
              <input
                type="text"
                id="documentNumber"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                  errors.documentNumber ? 'border-red-500' : 'border-sage-300'
                }`}
                placeholder="12345678"
              />
              {errors.documentNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.documentNumber}</p>
              )}
            </div>
          </div>

          {/* Subir fotos del documento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="documentFront" className="block text-sm font-medium text-sage-700 mb-2">
                Foto frontal del documento *
              </label>
              <input
                type="file"
                id="documentFront"
                name="documentFront"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => handleFileChange(e, 'documentFront')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                  errors.documentFront ? 'border-red-500' : 'border-sage-300'
                }`}
              />
              <p className="text-xs text-sage-500 mt-1">Formatos: PNG, JPG, PDF</p>
              {errors.documentFront && (
                <p className="text-red-500 text-sm mt-1">{errors.documentFront}</p>
              )}
            </div>

            <div>
              <label htmlFor="documentBack" className="block text-sm font-medium text-sage-700 mb-2">
                Foto del reverso del documento *
              </label>
              <input
                type="file"
                id="documentBack"
                name="documentBack"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => handleFileChange(e, 'documentBack')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors ${
                  errors.documentBack ? 'border-red-500' : 'border-sage-300'
                }`}
              />
              <p className="text-xs text-sage-500 mt-1">Formatos: PNG, JPG, PDF</p>
              {errors.documentBack && (
                <p className="text-red-500 text-sm mt-1">{errors.documentBack}</p>
              )}
            </div>
          </div>

          {/* Métodos de cobro */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Método de cobro * (selecciona al menos uno)
            </label>
            
            <div className="space-y-4">
              {/* CBU */}
              <div>
                <label htmlFor="cbu" className="block text-sm text-sage-600 mb-1">
                  CBU (22 dígitos)
                </label>
                <input
                  type="text"
                  id="cbu"
                  name="paymentMethods.cbu"
                  value={formData.paymentMethods.cbu}
                  onChange={handleInputChange}
                  maxLength={22}
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors"
                  placeholder="1234567890123456789012"
                />
              </div>

              {/* MercadoPago */}
              <div>
                <label htmlFor="mercadoPago" className="block text-sm text-sage-600 mb-1">
                  MercadoPago (alias o email)
                </label>
                <input
                  type="email"
                  id="mercadoPago"
                  name="paymentMethods.mercadoPago"
                  value={formData.paymentMethods.mercadoPago}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Lemon */}
              <div>
                <label htmlFor="lemon" className="block text-sm text-sage-600 mb-1">
                  Lemon (wallet address)
                </label>
                <input
                  type="text"
                  id="lemon"
                  name="paymentMethods.lemon"
                  value={formData.paymentMethods.lemon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent transition-colors"
                  placeholder="0x..."
                />
              </div>

              {/* Stripe */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="stripe"
                  name="paymentMethods.stripe"
                  checked={formData.paymentMethods.stripe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-zen-600 border-sage-300 rounded focus:ring-zen-500"
                />
                <label htmlFor="stripe" className="text-sm text-sage-600">
                  Stripe (conexión vía API)
                </label>
              </div>
            </div>

            {errors.paymentMethods && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentMethods}</p>
            )}
          </div>

          {/* Validación de identidad */}
          <div className="bg-sage-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="identityVerification"
                name="identityVerification"
                checked={formData.identityVerification}
                onChange={handleInputChange}
                className="w-4 h-4 text-zen-600 border-sage-300 rounded focus:ring-zen-500 mt-1"
              />
              <label htmlFor="identityVerification" className="text-sm text-sage-700">
                <strong>Confirmo que mis datos son correctos y autorizo la validación de identidad.</strong>
                <br />
                <span className="text-sage-600">
                  Al marcar esta casilla, acepto que FlowCasaZen verifique mi identidad mediante los documentos proporcionados.
                </span>
              </label>
            </div>
            {errors.identityVerification && (
              <p className="text-red-500 text-sm mt-2">{errors.identityVerification}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-4 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
            >
              ← Volver
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-zen-600 hover:bg-zen-700 focus:ring-2 focus:ring-zen-500 focus:ring-offset-2'
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar y continuar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegistrationForm;