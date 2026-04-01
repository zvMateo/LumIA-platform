"use client";

import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";

const PLANS = [
  {
    name: "Individual",
    price: "$2.990",
    currency: "ARS · o USD 3 · pago único",
    description: "Para estudiantes que quieren descubrir su vocación",
    features: [
      "25 preguntas de análisis de perfil",
      "Código Holland RIASEC personalizado",
      "Top 5 carreras con % de compatibilidad",
      "Informe PDF completo por email",
    ],
    cta: "Empezar ahora",
    highlight: true,
    action: () =>
      document
        .getElementById("chat-section")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    name: "Institucional",
    price: "A consultar",
    currency: "por cantidad de alumnos",
    description: "Para colegios y centros de orientación",
    features: [
      "Todo lo del plan Individual",
      "Dashboard para orientadores",
      "Reportes grupales por curso",
      "Soporte prioritario",
    ],
    cta: "Contactar ventas",
    highlight: false,
    action: () => {
      window.location.href = "mailto:ventas@goodapps.space";
    },
  },
  {
    name: "API / White Label",
    price: "A medida",
    currency: "según volumen",
    description: "Para plataformas educativas y EdTech",
    features: [
      "API REST completa",
      "White label personalizable",
      "SLA garantizado",
      "Integración técnica incluida",
    ],
    cta: "Solicitar demo",
    highlight: false,
    action: () => {
      window.location.href = "mailto:tech@goodapps.space";
    },
  },
];

export function Pricing() {
  return (
    <motion.section
      id="pricing"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="py-24 px-6 bg-surface-container-low"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="font-headline text-4xl font-extrabold tracking-tight text-on-background mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Planes para cada necesidad
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Empezá gratis y desbloqueá el informe completo cuando estés listo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-surface-container-lowest p-10 rounded-3xl flex flex-col transition-all ${
                plan.highlight
                  ? "ring-2 ring-primary shadow-2xl shadow-indigo-500/10 md:-translate-y-4"
                  : "shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-10 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Más popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-bold text-on-surface mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black text-on-background">
                  {plan.price}
                </span>
                <p className="text-xs text-on-surface-variant mt-1">
                  {plan.currency}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CircleCheck
                      className="w-5 h-5 text-primary shrink-0 mt-0.5"
                      style={{ fill: "rgba(53,37,205,0.1)" }}
                    />
                    <span className="text-sm text-on-surface-variant">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.action}
                className={`w-full py-4 rounded-full font-bold text-sm transition-all active:scale-95 ${
                  plan.highlight
                    ? "text-white shadow-lg shadow-indigo-200"
                    : "bg-inverse-surface text-white hover:opacity-90"
                }`}
                style={
                  plan.highlight
                    ? {
                        background: "linear-gradient(135deg, #3525cd, #4f46e5)",
                      }
                    : undefined
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
