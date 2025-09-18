import React from 'react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'student' | 'teacher') => void;
  onBack: () => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">FlowCasaZen</h1>
          <p className="text-sage-600">Selecciona tu rol en la plataforma</p>
        </div>

        <div className="space-y-6">
          {/* Pregunta principal */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-sage-800 mb-4">
              ¿Querés dar clases como Profesor?
            </h2>
            <p className="text-sage-600 text-sm">
              Esta decisión determinará el tipo de cuenta que se creará
            </p>
          </div>

          {/* Opciones de rol */}
          <div className="space-y-4">
            {/* Opción Alumno */}
            <button
              onClick={() => onRoleSelect('student')}
              className="w-full p-6 border-2 border-sage-200 rounded-xl hover:border-zen-400 hover:bg-zen-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center group-hover:bg-zen-100 transition-colors">
                  <svg className="w-6 h-6 text-sage-600 group-hover:text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sage-800 group-hover:text-zen-800">Alumno</h3>
                  <p className="text-sm text-sage-600 group-hover:text-zen-600">
                    Accede a clases de yoga online y mejora tu práctica
                  </p>
                </div>
              </div>
            </button>

            {/* Opción Profesor */}
            <button
              onClick={() => onRoleSelect('teacher')}
              className="w-full p-6 border-2 border-sage-200 rounded-xl hover:border-zen-400 hover:bg-zen-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center group-hover:bg-zen-100 transition-colors">
                  <svg className="w-6 h-6 text-sage-600 group-hover:text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sage-800 group-hover:text-zen-800">Profesor</h3>
                  <p className="text-sm text-sage-600 group-hover:text-zen-600">
                    Crea y vende tus clases de yoga a estudiantes
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Botón de regreso */}
          <div className="pt-4">
            <button
              onClick={onBack}
              className="w-full py-3 px-4 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
            >
              ← Volver al formulario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
