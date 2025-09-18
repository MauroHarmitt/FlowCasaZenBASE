import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import RoleSelection from './RoleSelection';
import TeacherRegistrationForm from './TeacherRegistrationForm';
import EmailVerification from './EmailVerification';
import { saveUser } from '../utils/userStorage';

type RegistrationStep = 'basic' | 'role' | 'teacher' | 'email-verification' | 'complete';

interface BasicFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  timezone: string;
}

interface TeacherFormData extends BasicFormData {
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

interface RegistrationFlowProps {
  onGoToLogin?: () => void;
  onGoToDashboard?: (userData: any) => void;
}

const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ onGoToLogin, onGoToDashboard }) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic');
  const [basicData, setBasicData] = useState<BasicFormData | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherFormData | null>(null);
  const [savedUserId, setSavedUserId] = useState<string | null>(null);

  const handleBasicFormComplete = async (data: BasicFormData) => {
    setBasicData(data);
    setCurrentStep('role');
  };

  const handleRoleSelect = async (role: 'student' | 'teacher') => {
    setUserRole(role);
    
    if (role === 'student') {
      // Para estudiantes, guardar usuario y ir a verificación de email
      const userData = {
        firstName: basicData!.firstName,
        lastName: basicData!.lastName,
        email: basicData!.email,
        password: basicData!.password,
        country: basicData!.country,
        timezone: basicData!.timezone,
        role: 'student' as const,
        isVerified: true, // Los estudiantes están verificados inmediatamente
        isFirstLogin: true
      };
      
      const savedUser = await saveUser(userData);
      setSavedUserId(savedUser.id);
      setCurrentStep('email-verification');
    } else {
      // Para profesores, ir al formulario extendido
      setCurrentStep('teacher');
    }
  };

  const handleTeacherFormComplete = async (data: TeacherFormData) => {
    setTeacherData(data);
    
    // Guardar usuario profesor
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      country: data.country,
      timezone: data.timezone,
      role: 'teacher' as const,
      isVerified: false, // Los profesores necesitan verificación
      isFirstLogin: true,
      profession: data.profession,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      paymentMethods: data.paymentMethods
    };
    
    const savedUser = await saveUser(userData);
    setSavedUserId(savedUser.id);
    setCurrentStep('email-verification');
  };

  const handleEmailVerificationComplete = () => {
    setCurrentStep('complete');
  };

  const handleResendEmail = async () => {
    // Simular envío de email
    console.log('Reenviando email de verificación a:', basicData?.email);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleBackToBasic = () => {
    setCurrentStep('basic');
  };

  const handleBackToRole = () => {
    setCurrentStep('role');
  };

  const renderCompleteStep = () => {
    const isTeacher = userRole === 'teacher';
    const data = isTeacher ? teacherData : basicData;

    return (
      <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-sage-800 mb-2">¡Bienvenido a FlowCasaZen!</h1>
            <p className="text-sage-600">
              {isTeacher ? 'Tu cuenta de profesor ha sido creada exitosamente' : 'Tu cuenta de estudiante ha sido creada exitosamente'}
            </p>
          </div>

          <div className="bg-sage-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-sage-800 mb-2">Resumen de tu cuenta:</h3>
            <div className="text-left space-y-2 text-sm text-sage-700">
              <p><strong>Nombre:</strong> {data?.firstName} {data?.lastName}</p>
              <p><strong>Email:</strong> {data?.email}</p>
              <p><strong>País:</strong> {data?.country}</p>
              <p><strong>Rol:</strong> {isTeacher ? 'Profesor' : 'Estudiante'}</p>
              {isTeacher && teacherData && (
                <>
                  <p><strong>Profesión:</strong> {teacherData.profession}</p>
                  <p><strong>Documento:</strong> {teacherData.documentType} - {teacherData.documentNumber}</p>
                </>
              )}
            </div>
          </div>

          {/* Estado de la cuenta */}
          <div className={`rounded-lg p-4 mb-6 ${
            isTeacher ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              isTeacher ? 'text-yellow-800' : 'text-green-800'
            }`}>
              {isTeacher ? 'Estado de tu cuenta' : '¡Cuenta activa!'}
            </h3>
            <p className={`text-sm ${
              isTeacher ? 'text-yellow-700' : 'text-green-700'
            }`}>
              {isTeacher ? (
                <>
                  Tu cuenta está en estado <strong>"Pendiente de aprobación"</strong>.
                  <br />
                  Revisaremos tus documentos y te notificaremos cuando esté activa.
                </>
              ) : (
                <>
                  Tu email ha sido verificado y tu cuenta está activa.
                  <br />
                  ¡Ya puedes acceder a todas las clases disponibles!
                </>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setCurrentStep('basic');
                setBasicData(null);
                setUserRole(null);
                setTeacherData(null);
                setSavedUserId(null);
              }}
              className="w-full py-3 px-4 bg-zen-600 hover:bg-zen-700 text-white rounded-lg font-medium transition-colors"
            >
              Crear otra cuenta
            </button>
            
            <button
              onClick={() => {
                if (onGoToDashboard && savedUserId) {
                  // Obtener datos del usuario guardado
                  const userData = {
                    id: savedUserId,
                    email: data?.email || '',
                    firstName: data?.firstName || '',
                    lastName: data?.lastName || '',
                    role: isTeacher ? 'teacher' : 'student',
                    isVerified: !isTeacher,
                    isFirstLogin: true
                  };
                  onGoToDashboard(userData);
                } else {
                  console.log('Ir al dashboard');
                }
              }}
              className="w-full py-3 px-4 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  switch (currentStep) {
    case 'basic':
      return <RegistrationForm onComplete={handleBasicFormComplete} onGoToLogin={onGoToLogin} />;
    
    case 'role':
      return (
        <RoleSelection 
          onRoleSelect={handleRoleSelect}
          onBack={handleBackToBasic}
        />
      );
    
    case 'teacher':
      return (
        <TeacherRegistrationForm
          basicData={basicData!}
          onComplete={handleTeacherFormComplete}
          onBack={handleBackToRole}
        />
      );
    
    case 'email-verification':
      return (
        <EmailVerification
          email={basicData?.email || ''}
          userType={userRole || 'student'}
          onVerificationComplete={handleEmailVerificationComplete}
          onResendEmail={handleResendEmail}
        />
      );
    
    case 'complete':
      return renderCompleteStep();
    
    default:
      return <RegistrationForm onComplete={handleBasicFormComplete} onGoToLogin={onGoToLogin} />;
  }
};

export default RegistrationFlow;