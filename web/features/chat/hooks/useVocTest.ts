'use client';

import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/shared/lib/axios';
import { API_ROUTES } from '@/shared/constants/api';
import { useChatStore } from '../store/chat.store';
import type { ChatRequest, ChatResponse, StatusResponse } from '@voctest/shared';

const PAYMENT_GATE_AT  = 3;
const POLLING_INTERVAL = 3_000;
const POLLING_TIMEOUT  = 5 * 60 * 1_000;

export function useVocTest() {
  const store = useChatStore();
  const pollingStartRef = useRef<number | null>(null);

  // Init session on mount
  useEffect(() => {
    store.initSession();
  }, []); // eslint-disable-line

  // ── Send message mutation ──────────────────────────────────────────────────
  const sendMessage = useMutation<ChatResponse, Error, string>({
    mutationFn: (message: string) => {
      const payload: ChatRequest = {
        sessionId: store.sessionId,
        message,
        plan:      'b2c',
        userId:    null,
        tenantId:  null,
        email:     null,
        userName:  null,
      };
      return apiClient.post<ChatResponse>(API_ROUTES.chat, payload).then((r) => r.data);
    },

    onMutate: (message) => {
      store.addMessage('user', message);
    },

    onSuccess: (data) => {
      store.addMessage('agent', data.message);
      store.setPhase(data.phase);
      store.setQuestionCount(data.questionCount);

      // Payment gate: open if threshold reached and not paid
      if (data.questionCount >= PAYMENT_GATE_AT && !store.isPaid && data.phase !== 'COMPLETE') {
        store.setShowPaymentGate(true);
        return;
      }

      // Start polling ONLY when test is truly complete.
      // 'AWAITING_EMAIL' means the agent is waiting for user input → keep input enabled.
      const isAwaitingEmail = data.phase === 'AWAITING_EMAIL';

      if ((data.testCompleto || data.phase === 'COMPLETE') && !isAwaitingEmail) {
        store.setPolling(true);
        pollingStartRef.current = Date.now();
      }
    },

    onError: (error) => {
      const axiosError = error as any;
      if (
        axiosError?.response?.status === 403 &&
        axiosError?.response?.data?.code === 'PAYMENT_REQUIRED'
      ) {
        store.setShowPaymentGate(true);
        return;
      }
      toast.error('No se pudo enviar el mensaje', {
        description: 'Verificá tu conexión e intentá de nuevo.',
      });
    },

    retry: (count, error: any) => {
      if (error?.response?.status < 500) return false;
      return count < 2;
    },
  });

  // ── Polling query ──────────────────────────────────────────────────────────
  const pollingQuery = useQuery<StatusResponse>({
    queryKey: ['voctest-status', store.sessionId],
    queryFn: () =>
      apiClient
        .post<StatusResponse>(API_ROUTES.status, { sessionId: store.sessionId })
        .then((r) => r.data),
    enabled: store.isPolling && !!store.sessionId,
    refetchInterval: (query) => {
      if (!store.isPolling) return false;
      if (pollingStartRef.current && Date.now() - pollingStartRef.current > POLLING_TIMEOUT) {
        store.setPolling(false);
        toast.warning('Tu informe está tardando más de lo esperado', {
          description: 'Lo estamos procesando. Podés recargar la página en unos minutos.',
          duration: 8000,
        });
        return false;
      }
      const data = query.state.data;
      if (data && 'ready' in data && data.ready) return false;
      return POLLING_INTERVAL;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  // Set result when polling returns ready
  useEffect(() => {
    const data = pollingQuery.data;
    if (data && 'ready' in data && data.ready) {
      store.setResult(data);
      toast.success('¡Tu informe vocacional está listo!', {
        description: 'Descubrí tu perfil RIASEC y tus carreras recomendadas.',
        duration: 5000,
      });
    }
  }, [pollingQuery.data]); // eslint-disable-line

  return {
    messages:        store.messages,
    phase:           store.phase,
    questionCount:   store.questionCount,
    isPaid:          store.isPaid,
    isLoading:       sendMessage.isPending,
    showPaymentGate: store.showPaymentGate,
    isPolling:       store.isPolling,
    result:          store.result,
    sessionId:       store.sessionId,
    sendMessage:     sendMessage.mutate,
    markAsPaid:      store.markAsPaid,
    resetSession:    store.resetSession,
  };
}
