declare module 'mercadopago' {
  interface MercadoPagoConfig {
    access_token: string;
    sandbox?: boolean;
  }

  interface PreferenceItem {
    title: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
  }

  interface PreferenceInput {
    items: PreferenceItem[];
    back_urls?: { success: string; failure: string; pending: string };
    auto_return?: string;
    external_reference?: string;
    notification_url?: string;
  }

  interface PreferenceResponse {
    body: {
      id: string;
      init_point: string;
      sandbox_init_point: string;
    };
  }

  interface PayerIdentification {
    type: string;
    number: string;
  }

  interface PaymentPayer {
    email: string;
    identification?: PayerIdentification;
  }

  interface PaymentInput {
    transaction_amount: number;
    token: string;
    installments: number;
    payment_method_id: string;
    issuer_id?: number;
    payer: PaymentPayer;
    description?: string;
    external_reference?: string;
    notification_url?: string;
  }

  interface PaymentResponse {
    body: {
      id: number;
      status: string;
      status_detail: string;
      external_reference?: string;
    };
  }

  const preferences: {
    create: (preference: PreferenceInput) => Promise<PreferenceResponse>;
  };

  const payment: {
    create: (data: PaymentInput) => Promise<PaymentResponse>;
    get: (id: string | number) => Promise<PaymentResponse>;
  };

  function configure(config: MercadoPagoConfig): void;

  export { configure, preferences, payment };
  export default { configure, preferences, payment };
}
