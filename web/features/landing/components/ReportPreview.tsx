'use client';

import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

const MOCK_CAREERS = [
  { rank: '01', name: 'Diseño Industrial',    match: 98 },
  { rank: '02', name: 'Arquitectura',          match: 85 },
  { rank: '03', name: 'Ingeniería Multimedia', match: 79 },
];

const RIASEC_MOCK = [
  { key: 'R', label: 'Realista',      value: 40 },
  { key: 'I', label: 'Investigador',  value: 88 },
  { key: 'A', label: 'Artístico',     value: 85 },
  { key: 'S', label: 'Social',        value: 55 },
  { key: 'E', label: 'Emprendedor',   value: 72 },
  { key: 'C', label: 'Convencional',  value: 30 },
];

export function ReportPreview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      id="report-preview"
      className="py-24 px-6 bg-surface"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="font-headline text-4xl font-extrabold tracking-tight mb-2"
            style={{
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #3525cd, #712ae2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Un informe tan único como vos
          </h2>
          <p className="text-on-surface-variant">Esto es lo que recibís en tu email al completar el test</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-inverse-surface px-6 py-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="font-bold tracking-tight text-sm">Resultado de Orientación — Mateo G.</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(99,102,241,0.2)', color: '#c3c0ff' }}>
              Código Holland: IAE
            </span>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12">
            {/* RIASEC bars */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Tu Perfil RIASEC</p>
              <div className="space-y-4">
                {RIASEC_MOCK.map((r) => (
                  <div key={r.key} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-on-surface-variant text-center">{r.key}</span>
                    <span className="w-24 text-xs text-on-surface-variant">{r.label}</span>
                    <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${r.value}%`, background: 'linear-gradient(90deg, #3525cd, #4f46e5)' }}
                      />
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant w-6 text-right">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career recommendations */}
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Top 3 Recomendaciones</p>
              <div className="space-y-3">
                {MOCK_CAREERS.map((c, i) => (
                  <div
                    key={c.rank}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${i === 0 ? 'bg-indigo-50' : 'hover:bg-surface-container-low'}`}
                    style={i === 0 ? { border: '1px solid rgba(99,102,241,0.15)' } : undefined}
                  >
                    <span className={`text-2xl font-black ${i === 0 ? 'text-primary' : 'text-surface-container-highest'}`}>
                      {c.rank}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{c.name}</p>
                      <p className="text-xs text-on-surface-variant">Match del {c.match}%</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 text-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
                style={{ border: '2px solid rgba(53,37,205,0.12)' }}>
                <Download className="w-4 h-4" />
                Descargar Reporte PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
