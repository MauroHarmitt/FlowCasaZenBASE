import React, { useState, useEffect } from 'react';

interface EmailVerificationProps {
  email: string;
  userType: 'student' | 'teacher';
  onVerificationComplete: () => void;
  onResendEmail: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  userType,
  onVerificationComplete,
  onResendEmail
}) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await onResendEmail();
      setCountdown(60);
      setCanResend(false);
      
      // Restart countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error al reenviar email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    // Simular verificación
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onVerificationComplete();
    } catch (error) {
      console.error('Error al verificar:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zen-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">Verifica tu email</h1>
          <p className="text-sage-600">
            Hemos enviado un enlace de verificación a:
          </p>
          <p className="font-semibold text-zen-700 mt-2">{email}</p>
        </div>

        <div className="space-y-6">
          {/* Instrucciones */}
          <div className="bg-sage-50 rounded-lg p-4">
            <h3 className="font-semibold text-sage-800 mb-2">¿Qué hacer ahora?</h3>
            <ol className="text-sm text-sage-700 space-y-1 list-decimal list-inside">
              <li>Revisa tu bandeja de entrada</li>
              <li>Busca el email de FlowCasaZen</li>
              <li>Haz clic en el enlace de verificación</li>
              <li>Vuelve aquí y haz clic en "Verificar"</li>
            </ol>
          </div>

          {/* Estado según tipo de usuario */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              {userType === 'teacher' ? 'Estado de tu cuenta' : 'Próximos pasos'}
            </h3>
            <p className="text-sm text-blue-700">
              {userType === 'teacher' ? (
                <>
                  Tu cuenta está en estado <strong>"Pendiente de aprobación"</strong>.
                  <br />
                  Una vez verificado tu email, revisaremos tus documentos y te notificaremos cuando tu cuenta esté activa.
                </>
              ) : (
                <>
                  Una vez verificado tu email, tendrás acceso inmediato a todas las clases de yoga disponibles.
                </>
              )}
            </p>
          </div>

          {/* Botón de verificación */}
          <button
            onClick={handleCheckVerification}
            className="w-full py-3 px-4 bg-zen-600 hover:bg-zen-700 text-white rounded-lg font-medium transition-colors"
          >
            Verificar email
          </button>

          {/* Reenviar email */}
          <div className="text-center">
            <p className="text-sm text-sage-600 mb-2">
              ¿No recibiste el email?
            </p>
            <button
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              className={`text-zen-600 hover:text-zen-700 font-medium transition-colors ${
                !canResend || isResending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isResending ? (
                'Reenviando...'
              ) : canResend ? (
                'Reenviar email'
              ) : (
                `Reenviar en ${countdown}s`
              )}
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-center text-xs text-sage-500">
            <p>
              Si no encuentras el email, revisa tu carpeta de spam o correo no deseado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
