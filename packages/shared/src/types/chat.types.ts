// packages/shared/src/types/chat.types.ts
export type Plan = 'b2c' | 'b2b' | 'b2b2c';
export type ChatPhase = 'WELCOME' | 'EXPLORING' | 'COMPLETE';

export interface ChatRequest {
  sessionId: string;
  message: string;
  plan: Plan;
  userId?: string | null;
  tenantId?: string | null;
  email?: string | null;
  userName?: string | null;
}

export interface ChatResponse {
  message: string;
  phase: ChatPhase;
  questionCount: number;
  sessionId: string;
  testCompleto: boolean;
  processing?: boolean;
}

export interface RiasecScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface CareerRecommendation {
  nombre: string;
  match: number;
  descripcion: string;
  area: string;
  duracion: string;
  salida: string;
}

export interface VocTestResult {
  ready: true;
  sessionId: string;
  hollandCode: string;
  perfilTitulo: string;
  perfilDescripcion: string;
  fortalezas: string[];
  areasDesarrollo?: string[];
  carreras: CareerRecommendation[];
  riasecScores: RiasecScores;
  consejosEstudio?: string[];
  fraseMotivadora: string;
  generadoEn: string;
}

export interface VocTestPending {
  ready: false;
  sessionId: string;
  message: string;
}

export type StatusResponse = VocTestResult | VocTestPending;
