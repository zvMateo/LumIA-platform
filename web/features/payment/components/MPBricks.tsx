'use client';

import { useEffect, useRef } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';

interface MPFormData {
  token: string;
  issuer_id?: number | string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: { email: string; identification?: { type: string; number: string } };
}

interface MPBricksProps {
  preferenceId: string;
  publicKey: string;
  onProcess: (formData: MPFormData) => Promise<void>;
}

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale?: string }) => {
      bricks: () => {
        create: (type: string, containerId: string, config: unknown) => Promise<unknown>;
      };
    };
  }
}

export function MPBricks({ preferenceId, publicKey, onProcess }: MPBricksProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !preferenceId || !publicKey) return;
    initialized.current = true;

    loadMercadoPago().then(() => {
      const mp = new window.MercadoPago(publicKey, { locale: 'es-AR' });
      const bricksBuilder = mp.bricks();

      bricksBuilder.create('payment', 'mp-payment-brick', {
        initialization: {
          amount: 2990,
          preferenceId,
        },
        customization: {
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            mercadoPago: 'all',
          },
          visual: {
            style: {
              theme: 'default',
              customVariables: {
                baseColor: '#4f46e5',
              },
            },
          },
        },
        callbacks: {
          onReady: () => {},
          onSubmit: ({ formData }: { formData: MPFormData }) => {
            return onProcess(formData);
          },
          onError: (error: unknown) => {
            const e = error as { type?: string };
            if (e?.type !== 'non_critical') {
              console.error('MP Payment Brick error:', error);
            }
          },
        },
      });
    });
  }, [preferenceId, publicKey]); // eslint-disable-line

  return (
    <div id="mp-payment-brick" className="min-h-16 w-full" />
  );
}
