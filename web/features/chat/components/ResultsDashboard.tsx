'use client';

import { motion } from 'framer-motion';
import type { VocTestResult, RiasecScores } from '@voctest/shared';

const RIASEC_LABELS: Record<keyof RiasecScores, string> = {
  R: 'Realista',
  I: 'Investigador',
  A: 'Artístico',
  S: 'Social',
  E: 'Emprendedor',
  C: 'Convencional',
};

const RIASEC_COLORS: Record<keyof RiasecScores, string> = {
  R: 'bg-amber-500',
  I: 'bg-blue-500',
  A: 'bg-purple-500',
  S: 'bg-green-500',
  E: 'bg-red-500',
  C: 'bg-cyan-500',
};

interface ResultsDashboardProps {
  result: VocTestResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const riasecEntries = Object.entries(result.riasecScores) as [keyof RiasecScores, number][];
  const maxScore = Math.max(...riasecEntries.map(([, v]) => v), 1);
  const topCareers = result.carreras.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 py-4"
    >
      {/* Holland Code */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">Tu código Holland</p>
        <div className="flex justify-center gap-2">
          {result.hollandCode.split('').map((letter, i) => (
            <span
              key={i}
              className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-lg font-bold"
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="font-semibold text-gray-800">{result.perfilTitulo}</p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">{result.perfilDescripcion}</p>
      </div>

      {/* RIASEC Bars */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Perfil RIASEC</p>
        {riasecEntries.map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-24 text-xs text-gray-500">{RIASEC_LABELS[key]}</span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${RIASEC_COLORS[key]}`}
                initial={{ width: 0 }}
                animate={{ width: `${(value / maxScore) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
            </div>
            <span className="w-6 text-xs text-right text-gray-500">{value}</span>
          </div>
        ))}
      </div>

      {/* Top Careers */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Top carreras recomendadas</p>
        {topCareers.map((career, i) => (
          <motion.div
            key={career.nombre}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-lg border border-brand-200 bg-brand-50 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-800 text-sm">{career.nombre}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{career.descripcion}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                {career.match}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Motivational phrase */}
      <div className="rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 p-4 text-center text-white">
        <p className="text-sm italic">"{result.fraseMotivadora}"</p>
      </div>

      {/* Strengths */}
      {result.fortalezas.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-gray-700">Tus fortalezas</p>
          <ul className="space-y-1">
            {result.fortalezas.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-brand-600 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
