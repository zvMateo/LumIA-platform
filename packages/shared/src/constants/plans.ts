// packages/shared/src/constants/plans.ts
export const PLAN_PRICES = {
  b2c: { ars: 2990, usd: 3, label: 'Estudiante' },
  b2b: { ars: 24900, usd: 25, label: 'Institución' },
  b2b2c: { ars: null, usd: null, label: 'Empresa' },
} as const;

export const PAYMENT_GATE_QUESTION = 3; // Se activa al llegar a esta pregunta
