import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { updatePurchaseStatus, getPurchaseById } from '../utils/purchaseStorage';

interface PaymentResultProps {
  onGoHome: () => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({ onGoHome }) => {
  const [searchParams] = useSearchParams();
  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const status = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');
  const purchaseId = searchParams.get('purchase_id');

  useEffect(() => {
    const handlePaymentResult = async () => {
      if (!purchaseId) {
        setLoading(false);
        return;
      }

      try {
        const purchaseData = getPurchaseById(purchaseId);
        if (purchaseData) {
          setPurchase(purchaseData);

          // Actualizar el estado de la compra según el resultado
          if (status === 'approved') {
            updatePurchaseStatus(purchaseId, 'completed', paymentId || undefined);
          } else if (status === 'pending') {
            updatePurchaseStatus(purchaseId, 'pending', paymentId || undefined);
          } else {
            updatePurchaseStatus(purchaseId, 'failed', paymentId || undefined);
          }
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentResult();
  }, [status, paymentId, purchaseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zen-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando resultado del pago...</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'approved':
        return {
          icon: '✅',
          title: '¡Pago Exitoso!',
          message: 'Tu pago ha sido procesado correctamente.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'pending':
        return {
          icon: '⏳',
          title: 'Pago Pendiente',
          message: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'rejected':
      case 'cancelled':
        return {
          icon: '❌',
          title: 'Pago Rechazado',
          message: 'Tu pago no pudo ser procesado. Inténtalo de nuevo.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: '❓',
          title: 'Estado Desconocido',
          message: 'No se pudo determinar el estado del pago.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-xl p-8 text-center shadow-lg`}>
          <div className="text-6xl mb-4">{statusInfo.icon}</div>
          <h1 className={`text-2xl font-bold ${statusInfo.color} mb-4`}>
            {statusInfo.title}
          </h1>
          <p className="text-gray-700 mb-6">
            {statusInfo.message}
          </p>

          {purchase && (
            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Detalles de la compra:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Clase:</strong> {purchase.packTitle}</p>
                <p><strong>Profesor:</strong> {purchase.teacherName}</p>
                <p><strong>Monto:</strong> ${purchase.amount} {purchase.currency}</p>
                <p><strong>Fecha:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                {purchase.transactionId && (
                  <p><strong>ID de transacción:</strong> {purchase.transactionId}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {status === 'approved' && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  <strong>¡Felicidades!</strong> Ya tienes acceso a tu clase. 
                  Puedes encontrarla en tu dashboard.
                </p>
              </div>
            )}

            <button
              onClick={onGoHome}
              className="w-full bg-zen-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-zen-700 transition-colors"
            >
              Volver al Inicio
            </button>

            {status === 'approved' && (
              <button
                onClick={() => {
                  // Aquí se podría navegar al dashboard del estudiante
                  console.log('Ir al dashboard');
                }}
                className="w-full bg-sage-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sage-700 transition-colors"
              >
                Ir a Mi Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;