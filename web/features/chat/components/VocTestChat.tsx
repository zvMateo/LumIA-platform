'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useVocTest } from '../hooks/useVocTest';
import { MessageBubble } from './MessageBubble';
import { ResultsDashboard } from './ResultsDashboard';
import { PaymentGate } from '@/features/payment/components/PaymentGate';

const TOTAL_QUESTIONS = 25;

export function VocTestChat() {
  const {
    messages,
    isLoading,
    showPaymentGate,
    result,
    isPolling,
    questionCount,
    sendMessage,
  } = useVocTest();

  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isPolling) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (result) return <ResultsDashboard result={result} />;

  return (
    <div className="relative flex flex-col h-150 w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Orientador Vocacional IA</p>
          <p className="text-xs text-emerald-500 font-medium">En línea</p>
        </div>

        {/* Progress bar */}
        {questionCount > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${(questionCount / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{questionCount}/{TOTAL_QUESTIONS}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-sm text-slate-400">Iniciando conversación...</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs mr-2 shrink-0 mt-1">
              V
            </div>
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Polling indicator */}
        {isPolling && (
          <div className="flex justify-center">
            <div className="bg-brand-50 border border-brand-100 text-brand-600 text-xs px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
              Generando tu informe personalizado...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu respuesta..."
            disabled={isLoading || isPolling}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50 transition-all max-h-24"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isPolling}
            className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          Primeros 3 mensajes gratis · Después ARS $2.990
        </p>
      </div>

      {/* Payment Gate Modal */}
      {showPaymentGate && <PaymentGate />}
    </div>
  );
}
