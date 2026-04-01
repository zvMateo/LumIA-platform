'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useChatStore } from '@/features/chat/store/chat.store';
import { usePayment, usePaymentStatus } from '../hooks/usePayment';
import { MPBricks } from './MPBricks';

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? '';

export function PaymentGate() {
  const { showPaymentGate, sessionId, markAsPaid } = useChatStore();

  const { createPreference, processPayment } = usePayment();
  const preferenceId = createPreference.data?.preferenceId ?? null;

  const paymentStatus = usePaymentStatus(sessionId, showPaymentGate && !!preferenceId);

  useEffect(() => {
    if (showPaymentGate && !preferenceId && !createPreference.isPending) {
      createPreference.mutate({ sessionId, plan: 'b2c' });
    }
  }, [showPaymentGate]); // eslint-disable-line

  useEffect(() => {
    if (paymentStatus.data?.approved) {
      markAsPaid();
      toast.success('¡Pago aprobado!', {
        description: 'Ya podés continuar con el test completo.',
        duration: 5000,
      });
    }
  }, [paymentStatus.data?.approved, markAsPaid]);

  const handleProcess = (formData: Record<string, unknown>): Promise<void> => {
    const promise = processPayment.mutateAsync({ sessionId, ...formData } as any).then(() => {});
    toast.promise(promise, {
      loading: 'Procesando tu pago...',
      success: 'Pago enviado. Aguardá la confirmación.',
      error: 'No se pudo procesar el pago. Intentá con otra tarjeta.',
    });
    return promise;
  };

  return (
    <Dialog
      open={showPaymentGate}
      onOpenChange={() => { /* non-dismissable */ }}
    >
      <DialogContent
        className="flex flex-col sm:max-w-xl w-full max-h-[92vh] p-0 gap-0 overflow-hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Header compacto */}
        <div className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold leading-tight">
              Desbloqueá tu informe vocacional completo
            </DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Continuá las {25} preguntas y recibí tu perfil RIASEC + top 5 carreras.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-2xl font-extrabold text-brand-700">$2.990</span>
              <span className="text-xs text-muted-foreground ml-1">ARS · USD 3</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {['Código Holland RIASEC', 'Top 5 carreras recomendadas', 'Informe PDF por email'].map((f) => (
                <li key={f} className="flex items-center gap-1">
                  <span className="text-brand-600 font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Área del brick — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {createPreference.isPending && (
            <p className="text-center text-sm text-muted-foreground animate-pulse py-8">
              Preparando pago seguro...
            </p>
          )}
          {preferenceId && (
            <MPBricks
              preferenceId={preferenceId}
              publicKey={MP_PUBLIC_KEY}
              onProcess={(formData) => handleProcess(formData as any)}
            />
          )}
          {createPreference.isError && (
            <p className="text-center text-sm text-red-500 py-8">
              Error al iniciar el pago. Recargá la página e intentá de nuevo.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
