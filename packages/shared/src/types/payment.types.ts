// packages/shared/src/types/payment.types.ts
export interface CreatePreferenceRequest {
  sessionId: string;
  plan: 'b2c' | 'b2b' | 'b2b2c';
  email?: string | null;
  userName?: string | null;
}

export interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
