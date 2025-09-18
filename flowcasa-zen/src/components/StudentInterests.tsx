import React, { useState } from 'react';

interface StudentInterestsProps {
  onComplete: (interests: string[]) => void;
  onSkip: () => void;
}

const StudentInterests: React.FC<StudentInterestsProps> = ({ onComplete, onSkip }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const availableInterests = [
    { id: 'Yoga', label: 'Yoga', icon: '🧘‍♀️' },
    { id: 'Fitness', label: 'Fitness', icon: '💪' },
    { id: 'Malabares', label: 'Malabares', icon: '🤹‍♂️' },
    { id: 'Artes marciales', label: 'Artes Marciales', icon: '🥋' },
    { id: 'Pilates', label: 'Pilates', icon: '🤸‍♀️' },
    { id: 'Danza', label: 'Danza', icon: '💃' },
    { id: 'Meditación', label: 'Meditación', icon: '🧘‍♂️' },
    { id: 'Crossfit', label: 'Crossfit', icon: '🏋️‍♀️' }
  ];

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = () => {
    onComplete(selectedInterests);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zen-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">¡Bienvenido a FlowCasaZen!</h1>
          <p className="text-sage-600">
            Cuéntanos qué te interesa para personalizar tu experiencia
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-sage-800 mb-4">
              Selecciona tus intereses (opcional)
            </h2>
            <p className="text-sage-600 text-sm mb-6">
              Esto nos ayudará a recomendarte contenido y profesores que te gusten
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableInterests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 group ${
                  selectedInterests.includes(interest.id)
                    ? 'border-zen-400 bg-zen-50'
                    : 'border-sage-200 hover:border-zen-300 hover:bg-sage-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{interest.icon}</div>
                  <div className={`text-sm font-medium ${
                    selectedInterests.includes(interest.id)
                      ? 'text-zen-800'
                      : 'text-sage-700 group-hover:text-zen-700'
                  }`}>
                    {interest.label}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-sage-50 rounded-lg p-4">
            <h3 className="font-semibold text-sage-800 mb-2">¿Qué puedes hacer ahora?</h3>
            <ul className="text-sm text-sage-700 space-y-1">
              <li>• Buscar profesores por especialidad</li>
              <li>• Comprar packs de entrenamiento</li>
              <li>• Seguir a tus profesores favoritos</li>
              <li>• Guardar rutinas favoritas</li>
            </ul>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              onClick={onSkip}
              className="flex-1 py-3 px-4 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
            >
              Omitir por ahora
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-zen-600 hover:bg-zen-700 text-white rounded-lg font-medium transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInterests;
