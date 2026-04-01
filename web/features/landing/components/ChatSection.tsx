"use client";

import { motion } from "framer-motion";
import { Sparkles, BadgeCheck } from "lucide-react";
import { VocTestChat } from "@/features/chat/components/VocTestChat";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

const BENEFITS = [
  "Dinámico y entretenido, no es un formulario aburrido.",
  "Podés explayarte en tus respuestas libremente.",
  "Resultados personalizados basados en IA real.",
];

export function ChatSection() {
  return (
    <motion.section
      id="chat-section"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="py-24 px-6 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-background mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Probá las primeras 3 preguntas gratis
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Sin vueltas ni registros. Respondé ahora y empezá a descubrir tu
            camino profesional.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left panel */}
          <div className="lg:col-span-4 space-y-8">
            <div
              className="bg-indigo-50 p-6 rounded-2xl"
              style={{ border: "1px solid rgba(99,102,241,0.12)" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">LumIA</h4>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">
                    Siempre activa para vos
                  </p>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                A diferencia de los tests tradicionales, yo aprendo de lo que me
                contás. No hay respuestas correctas, solo lo que{" "}
                <span className="font-bold text-on-surface">vos</span> sentís.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-on-surface flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-indigo-600" />
                Beneficios del test conversacional
              </h4>
              <ul className="space-y-3">
                {BENEFITS.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-on-surface-variant text-sm items-start"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-8">
            <ErrorBoundary>
              <VocTestChat />
            </ErrorBoundary>
            <p className="mt-3 text-center text-xs text-on-surface-variant">
              El test completo cuesta $2.990 ARS · Pago seguro con MercadoPago
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
