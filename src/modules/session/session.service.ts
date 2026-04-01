// src/modules/session/session.service.ts
import { Injectable, ForbiddenException, HttpService } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import configuration from '../shared/config/configuration';
import { ChatRequest, ChatResponse, StatusResponse } from '@shared/index';

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @Inject(configuration.KEY)
    private config: ConfigType<typeof configuration>,
  ) {}

  async sendMessage(dto: ChatRequest): Promise<ChatResponse> {
    // Check if the session has paid if questionCount >= 3
    // We'll get the current question count from the n8n response or we need to track it
    // For now, we'll assume the frontend tracks questionCount and sends it in the request
    // But according to the spec, we need to check payment when questionCount >= 3
    
    // Actually, we need to get the current state from our DB or from n8n
    // Let's first check if we have a session state recorded
    
    // For simplicity in this implementation, we'll rely on the frontend to track
    // questionCount and we'll trust it, but we should verify with our DB
    // Let's check if we have a payment for this session
    
    const payment = await this.prisma.payment.findUnique({
      where: { sessionId: dto.sessionId },
    });
    
    const isPaid = payment?.status === 'approved';
    
    // If questionCount >= 3 and not paid, throw ForbiddenException
    // We don't have questionCount in the dto, so we need to get it from n8n or track it
    // According to the spec, the frontend should track questionCount and we need to verify
    // Let's modify the approach: we'll check payment status when we get the response from n8n
    // if the response indicates testCompleto is false and questionCount >= 3
    
    // For now, let's make the call to n8n and handle the payment check in the response
    // But the spec says: "verifica que la sesión tenga pago aprobado si questionCount >= 3"
    // So we need to know the questionCount. Let's assume the frontend sends it in a way we can access
    // Actually, looking at the ChatRequest, there's no questionCount field
    // The questionCount comes in the response from n8n
    
    // Let's change strategy: we'll call n8n first, then if the response shows
    // questionCount >= 3 and testCompleto is false, we'll check payment
    // But that's not ideal because we're making the call unnecessarily
    
    // Better approach: frontend should track questionCount and we should have a way to know it
    // Let's add a field to ChatRequest for questionCount even though it's not in the spec
    // Or we can retrieve it from our SessionState table
    
    // Let's check our SessionState table for the current questionCount
    const sessionState = await this.prisma.sessionState.findUnique({
      where: { sessionId: dto.sessionId },
    });
    
    const questionCount = sessionState?.questionCount ?? 0;
    
    if (questionCount >= 3 && !isPaid) {
      throw new ForbiddenException({
        code: 'PAYMENT_REQUIRED',
        message: 'Payment required to continue the test',
      });
    }
    
    // Make request to n8n webhook
    const n8nUrl = `${this.config.n8nWebhookUrl}/webhook/voctest/chat`;
    const response = await this.httpService.axiosRef.post<n8nChatResponse>(n8nUrl, dto);
    
    // Update session state based on n8n response
    await this.upsertSessionState(dto.sessionId, response.data);
    
    return response.data;
  }
  
  async getStatus(sessionId: string): Promise<StatusResponse> {
    // Make request to n8n status webhook
    const n8nUrl = `${this.config.n8nWebhookUrl}/webhook/voctest/status`;
    const response = await this.httpService.axiosRef.post<n8nStatusResponse>(
      n8nUrl,
      { sessionId }
    );
    
    // If ready is true, save/update the result in DB
    if (response.data.ready) {
      await this.upsertTestResult(sessionId, response.data);
    }
    
    return response.data;
  }
  
  private async upsertSessionState(
    sessionId: string,
    n8nResponse: ChatResponse
  ) {
    await this.prisma.sessionState.upsert({
      where: { sessionId },
      update: {
        questionCount: n8nResponse.questionCount,
        phase: n8nResponse.phase,
      },
      create: {
        sessionId,
        questionCount: n8nResponse.questionCount,
        phase: n8nResponse.phase,
      },
    });
  }
  
  private async upsertTestResult(
    sessionId: string,
    n8nResponse: VocTestResult
  ) {
    await this.prisma.testResult.upsert({
      where: { sessionId },
      update: {
        hollandCode: n8nResponse.hollandCode,
        riasecScores: n8nResponse.riasecScores,
        perfilTitulo: n8nResponse.perfilTitulo,
        perfilDescripcion: n8nResponse.perfilDescripcion,
        fortalezas: n8nResponse.fortalezas,
        carreras: n8nResponse.carreras,
        fraseMotivadora: n8nResponse.fraseMotivadora,
        rawResult: n8nResponse,
      },
      create: {
        sessionId,
        hollandCode: n8nResponse.hollandCode,
        riasecScores: n8nResponse.riasecScores,
        perfilTitulo: n8nResponse.perfilTitulo,
        perfilDescripcion: n8nResponse.perfilDescripcion,
        fortalezas: n8nResponse.fortalezas,
        carreras: n8nResponse.carreras,
        fraseMotivadora: n8nResponse.fraseMotivadora,
        rawResult: n8nResponse,
      },
    });
  }
}

// Interface for n8n chat response (based on spec)
interface n8nChatResponse {
  message: string;
  phase: 'WELCOME' | 'EXPLORING' | 'COMPLETE';
  questionCount: number;
  sessionId: string;
  testCompleto: boolean;
  processing?: boolean;
}

// Interface for n8n status response (based on spec)
interface n8nStatusResponse =
  | {
      ready: true;
      sessionId: string;
      hollandCode: string;
      perfilTitulo: string;
      perfilDescripcion: string;
      fortalezas: string[];
      carreras: Array<{
        nombre: string;
        match: number;
        descripcion: string;
        area: string;
        duracion: string;
        salida: string;
      }>;
      riasecScores: { R: number; I: number; A: number; S: number; E: number; C: number };
      fraseMotivadora: string;
      generadoEn: string;
    }
  | {
      ready: false;
      sessionId: string;
      message: string;
    };
