import React, { useState } from 'react';

interface TeacherTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TeacherTutorial: React.FC<TeacherTutorialProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: '¡Bienvenido a FlowCasaZen!',
      content: 'Como profesor, podrás crear y vender contenido de yoga y fitness a estudiantes de todo el mundo.',
      icon: '👋',
      features: [
        'Crea packs de entrenamiento',
        'Sube videos y rutinas',
        'Gestiona tus ingresos',
        'Conecta con estudiantes'
      ]
    },
    {
      title: 'Crear Contenido',
      content: 'Puedes subir diferentes tipos de contenido para tus estudiantes.',
      icon: '📹',
      features: [
        'Reels cortos (máx. 1 min)',
        'Videos largos (1h - 1h30)',
        'PDFs con planes de entrenamiento',
        'Organiza en packs temáticos'
      ]
    },
    {
      title: 'Gestionar Ingresos',
      content: 'Monitorea tus ganancias y solicita retiros cuando necesites.',
      icon: '💰',
      features: [
        'Ve packs vendidos',
        'Estadísticas de alumnos activos',
        'Ingresos por mes',
        'Retiros a CBU/MP/Lemon/Stripe'
      ]
    },
    {
      title: 'Calendario de Actividades',
      content: 'Organiza tu contenido y programa cuándo publicar nuevas rutinas.',
      icon: '📅',
      features: [
        'Planifica tus semanas',
        'Programa publicaciones',
        'Organiza clases futuras',
        'Mantén a tus estudiantes comprometidos'
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zen-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{currentTutorial.icon}</span>
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">{currentTutorial.title}</h1>
          <p className="text-sage-600">{currentTutorial.content}</p>
        </div>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-sage-200 rounded-full h-2">
            <div 
              className="bg-zen-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            ></div>
          </div>

          {/* Features list */}
          <div className="bg-sage-50 rounded-lg p-6">
            <h3 className="font-semibold text-sage-800 mb-4">Características principales:</h3>
            <ul className="space-y-2">
              {currentTutorial.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sage-700">
                  <div className="w-2 h-2 bg-zen-500 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Step indicator */}
          <div className="text-center text-sm text-sage-500">
            Paso {currentStep + 1} de {tutorialSteps.length}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              onClick={handleSkip}
              className="text-sage-500 hover:text-sage-700 font-medium transition-colors"
            >
              Omitir tutorial
            </button>

            <div className="flex space-x-4">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="py-2 px-4 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  Anterior
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="py-2 px-6 bg-zen-600 hover:bg-zen-700 text-white rounded-lg font-medium transition-colors"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Comenzar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTutorial;
