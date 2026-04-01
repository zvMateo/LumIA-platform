import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatPhase, VocTestResult } from '@voctest/shared';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface ChatState {
  sessionId: string;
  messages: ChatMessage[];
  phase: ChatPhase;
  questionCount: number;
  isPaid: boolean;
  showPaymentGate: boolean;
  isPolling: boolean;
  result: VocTestResult | null;
  // actions
  initSession: () => void;
  addMessage: (role: 'user' | 'agent', content: string) => void;
  setPhase: (phase: ChatPhase) => void;
  setQuestionCount: (n: number) => void;
  markAsPaid: () => void;
  setShowPaymentGate: (show: boolean) => void;
  setPolling: (polling: boolean) => void;
  setResult: (result: VocTestResult) => void;
  resetSession: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessionId: '',
      messages: [],
      phase: 'WELCOME',
      questionCount: 0,
      isPaid: false,
      showPaymentGate: false,
      isPolling: false,
      result: null,

      initSession: () => {
        const state = get();
        if (!state.sessionId) {
          const id = crypto.randomUUID();
          set({ sessionId: id });
        }
        // Restore paid status from sessionStorage
        const sessionId = get().sessionId;
        if (typeof window !== 'undefined' && sessionId) {
          const paid = sessionStorage.getItem(`voc_paid_${sessionId}`) === 'true';
          if (paid && !get().isPaid) {
            set({ isPaid: true });
          }
        }
      },

      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { id: crypto.randomUUID(), role, content, timestamp: Date.now() },
          ],
        })),

      setPhase: (phase) => set({ phase }),
      setQuestionCount: (questionCount) => set({ questionCount }),

      markAsPaid: () => {
        const { sessionId } = get();
        if (typeof window !== 'undefined' && sessionId) {
          sessionStorage.setItem(`voc_paid_${sessionId}`, 'true');
        }
        set({ isPaid: true, showPaymentGate: false });
      },

      setShowPaymentGate: (showPaymentGate) => set({ showPaymentGate }),
      setPolling: (isPolling) => set({ isPolling }),
      setResult: (result) => set({ result, isPolling: false }),

      resetSession: () => {
        const { sessionId } = get();
        if (typeof window !== 'undefined' && sessionId) {
          sessionStorage.removeItem(`voc_paid_${sessionId}`);
        }
        const newId = crypto.randomUUID();
        set({
          sessionId: newId,
          messages: [],
          phase: 'WELCOME',
          questionCount: 0,
          isPaid: false,
          showPaymentGate: false,
          isPolling: false,
          result: null,
        });
      },
    }),
    {
      name: 'voctest-chat',
      partialize: (state) => ({
        sessionId: state.sessionId,
        isPaid: state.isPaid,
      }),
    }
  )
);
