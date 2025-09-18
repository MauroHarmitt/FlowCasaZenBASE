import React, { useEffect } from 'react';
import AuthFlow from './components/AuthFlow';
import { CartProvider } from './contexts/CartContext';
import { initializeSession } from './utils/sessionManager';
import './App.css';

function App() {
  // 🚀 Inicializar gestor de sesión al cargar la app
  useEffect(() => {
    const sessionStatus = initializeSession();
    console.log('🚀 App inicializada con estado de sesión:', sessionStatus);
  }, []);

  return (
    <div className="App">
      <CartProvider>
        <AuthFlow />
      </CartProvider>
    </div>
  );
}

export default App;
