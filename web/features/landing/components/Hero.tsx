'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CHAT_PREVIEW = [
  {
    role: 'agent',
    text: 'Hola! Soy LumIA 👋 Vamos a descubrir qué carrera te va mejor. Primera pregunta: cuando tenés que resolver un problema, ¿cómo preferís encararlo?',
    delay: 0.2,
  },
  {
    role: 'user',
    text: 'Me gusta analizar todas las opciones primero y después tomar una decisión con datos concretos.',
    delay: 0.7,
  },
  {
    role: 'agent',
    text: 'Interesante — eso dice mucho de tu perfil analítico. ¿Y en tu tiempo libre qué actividades te generan más satisfacción?',
    delay: 1.2,
  },
];

export function Hero() {
  const scrollToChat = () => {
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToReport = () => {
    document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden pt-20 pb-24 px-6"
      style={{ background: 'linear-gradient(135deg, #f0f3ff 0%, #ffffff 60%, #f5f0ff 100%)' }}
    >
      {/* Background orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8 text-center lg:text-left"
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5" style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              IA · Orientación Vocacional
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-background leading-[1.05]"
            style={{ letterSpacing: '-0.04em' }}
          >
            ¿No sabés qué estudiar?
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-lg mx-auto lg:mx-0">
            LumIA analiza tu personalidad con el modelo Holland RIASEC y te entrega un informe con las carreras que mejor se adaptan a{' '}
            <span className="font-bold text-primary underline decoration-2 underline-offset-4">vos</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
            <button
              onClick={scrollToChat}
              className="text-white px-9 py-4 rounded-full text-base font-bold shadow-xl shadow-indigo-200 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)' }}
            >
              Empezar el test gratis
            </button>
            <button
              onClick={scrollToReport}
              className="bg-surface-container-highest text-on-surface px-9 py-4 rounded-full text-base font-bold hover:bg-surface-container-high transition-colors"
            >
              Ver ejemplo de informe
            </button>
          </div>

          <p className="text-sm text-on-surface-variant/70 font-medium">
            25 preguntas · Sin registro previo · Informe PDF por email
          </p>
        </motion.div>

        {/* Right: chat mockup */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="hidden lg:block"
        >
          <div
            className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden max-w-md mx-auto"
            style={{ border: '1px solid rgba(79,70,229,0.08)' }}
          >
            {/* Chat header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)' }}>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">LumIA</p>
                <p className="text-indigo-200 text-xs">Orientación vocacional con IA</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs text-indigo-200">En línea</span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 bg-surface-container-low min-h-65">
              {CHAT_PREVIEW.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: msg.delay }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'agent' && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'bg-white text-on-surface rounded-tl-sm shadow-sm'
                    }`}
                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #3525cd, #4f46e5)' } : undefined}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9 }}
                className="flex gap-2 items-end"
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center shadow-sm">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms`, animationDuration: '1s' }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 bg-white flex items-center gap-3" style={{ borderTop: '1px solid rgba(79,70,229,0.06)' }}>
              <div className="flex-1 bg-surface-container-low rounded-full px-4 py-2.5 text-sm text-on-surface-variant/50">
                Escribí tu respuesta...
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)' }}
              >
                <svg className="w-4 h-4 text-white rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Progress pill below card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="mt-4 flex items-center justify-center gap-3"
          >
            <div className="flex-1 max-w-45 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full w-[12%] rounded-full" style={{ background: 'linear-gradient(90deg, #3525cd, #4f46e5)' }} />
            </div>
            <span className="text-xs text-on-surface-variant font-medium">Pregunta 3 de 25</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
