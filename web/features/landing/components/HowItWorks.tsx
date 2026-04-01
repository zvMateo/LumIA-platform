'use client';

import { motion } from 'framer-motion';
import { MessageCircle, BarChart2, FileText } from 'lucide-react';

const STEPS = [
  {
    icon: MessageCircle,
    num: 1,
    title: 'Conversá con la IA',
    description: 'No es un test de multiple choice. LumIA te hace preguntas situacionales que revelan tu verdadera vocación.',
  },
  {
    icon: BarChart2,
    num: 2,
    title: 'Analizamos tu perfil',
    description: 'Usamos el modelo Holland RIASEC para cruzar tus intereses con la oferta académica actual de Argentina.',
  },
  {
    icon: FileText,
    num: 3,
    title: 'Recibís tu informe',
    description: 'Obtené un PDF con carreras recomendadas, % de compatibilidad y universidades que encajan con vos.',
  },
];

export function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-24 px-6 bg-surface-container-low"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-background" style={{ letterSpacing: '-0.03em' }}>
            Tu camino al éxito en 3 pasos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ icon: Icon, num, title, description }) => (
            <div
              key={num}
              className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl shadow-indigo-500/5 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">
                  {num}
                </div>
                <Icon className="w-10 h-10 text-indigo-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-3">{title}</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
