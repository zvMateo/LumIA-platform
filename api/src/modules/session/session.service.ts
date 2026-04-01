import {
  Injectable,
  ForbiddenException,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import configuration from '../../shared/config/configuration';
import {
  ChatRequest,
  ChatResponse,
  StatusResponse,
  VocTestResult,
} from '@voctest/shared';

const FREE_QUESTIONS_LIMIT = 3;
const N8N_TIMEOUT_MS = 30_000;

type N8nStatusResponse =
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
      riasecScores: {
        R: number;
        I: number;
        A: number;
        S: number;
        E: number;
        C: number;
      };
      fraseMotivadora: string;
      generadoEn: string;
    }
  | {
      ready: false;
      sessionId: string;
      message: string;
    };

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @Inject(configuration.KEY)
    private config: ConfigType<typeof configuration>,
  ) {}

  async sendMessage(dto: ChatRequest): Promise<ChatResponse> {
    const [payment, sessionState] = await Promise.all([
      this.prisma.payment.findUnique({ where: { sessionId: dto.sessionId } }),
      this.prisma.sessionState.findUnique({
        where: { sessionId: dto.sessionId },
      }),
    ]);

    const isPaid = payment?.status === 'approved';
    const questionCount = sessionState?.questionCount ?? 0;

    if (questionCount >= FREE_QUESTIONS_LIMIT && !isPaid) {
      throw new ForbiddenException({
        code: 'PAYMENT_REQUIRED',
        message: 'Payment required to continue the test',
      });
    }

    let response;
    try {
      response = await this.httpService.axiosRef.post<ChatResponse>(
        this.config.n8nWebhookUrl,
        { ...dto, checkStatus: false },
        { timeout: N8N_TIMEOUT_MS },
      );
    } catch {
      throw new ServiceUnavailableException(
        'El servicio de análisis no está disponible',
      );
    }

    await this.upsertSessionState(dto.sessionId, response.data);

    return response.data;
  }

  async getStatus(sessionId: string): Promise<StatusResponse> {
    let response;
    try {
      response = await this.httpService.axiosRef.post<N8nStatusResponse>(
        this.config.n8nWebhookUrl,
        { sessionId, checkStatus: true },
        { timeout: N8N_TIMEOUT_MS },
      );
    } catch {
      throw new ServiceUnavailableException(
        'El servicio de análisis no está disponible',
      );
    }

    if (response.data.ready) {
      await this.upsertTestResult(sessionId, response.data);
    }

    return response.data;
  }

  private async upsertSessionState(
    sessionId: string,
    n8nResponse: ChatResponse,
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
    n8nResponse: VocTestResult,
  ) {
    const toJson = (v: unknown): Prisma.InputJsonValue =>
      JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;

    const data = {
      hollandCode: n8nResponse.hollandCode,
      riasecScores: toJson(n8nResponse.riasecScores),
      perfilTitulo: n8nResponse.perfilTitulo,
      perfilDescripcion: n8nResponse.perfilDescripcion,
      fortalezas: toJson(n8nResponse.fortalezas),
      carreras: toJson(n8nResponse.carreras),
      fraseMotivadora: n8nResponse.fraseMotivadora,
      rawResult: toJson(n8nResponse),
    };

    await this.prisma.testResult.upsert({
      where: { sessionId },
      update: data,
      create: { sessionId, ...data },
    });
  }
}
