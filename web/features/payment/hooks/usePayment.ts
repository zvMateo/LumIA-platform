'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import type { CreatePreferenceRequest, CreatePreferenceResponse } from '@voctest/shared';

interface ProcessPaymentRequest {
  sessionId: string;
  transaction_amount: number;
  token: string;
  installments: number;
  payment_method_id: string;
  issuer_id?: number | string;
  payer: { email: string; identification?: { type: string; number: string } };
}

interface ProcessPaymentResponse {
  paymentId: number;
  status: string;
}

export function usePayment() {
  const createPreference = useMutation({
    mutationFn: (dto: CreatePreferenceRequest) =>
      apiClient
        .post<CreatePreferenceResponse>('/payment/create-preference', dto)
        .then((r) => r.data),
  });

  const processPayment = useMutation({
    mutationFn: (dto: ProcessPaymentRequest) =>
      apiClient
        .post<ProcessPaymentResponse>('/payment/process', dto)
        .then((r) => r.data),
  });

  return { createPreference, processPayment };
}

export function usePaymentStatus(sessionId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['payment', 'status', sessionId],
    queryFn: () =>
      apiClient
        .get<{ approved: boolean }>(`/payment/status/${sessionId}`)
        .then((r) => r.data),
    enabled: enabled && !!sessionId,
    refetchInterval: (query) => {
      if (query.state.data?.approved) return false;
      return 3000;
    },
    staleTime: 0,
  });
}
