'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { useChatStore } from '@/features/chat/store/chat.store';
import { usePaymentStatus } from '@/features/payment/hooks/usePayment';

export default function PagoPendientePage() {
  const router = useRouter();
  const { sessionId } = useChatStore();
  const status = usePaymentStatus(sessionId, !!sessionId);

  useEffect(() => {
    if (status.data?.approved) {
      router.replace('/#chat-section');
    }
  }, [status.data?.approved, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-brand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
          <Clock className="w-9 h-9 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">Pago pendiente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Estamos esperando la confirmación. Serás redirigido automáticamente cuando se acredite.
          </p>
        </div>

        <p className="text-xs text-muted-foreground animate-pulse">Verificando estado del pago...</p>
      </div>
    </div>
  );
}
