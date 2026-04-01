import { createHmac } from 'crypto';
import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import mercadopago from 'mercadopago';
import { PrismaService } from '../../prisma/prisma.service';
import configuration from '../../shared/config/configuration';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { WebhookNotificationDto } from './dto/webhook-notification.dto';
import { MailService } from './mail.service';
import { PLAN_PRICES } from '@voctest/shared';

export enum PaymentStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  cancelled = 'cancelled',
  in_process = 'in_process',
}

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    @Inject(configuration.KEY)
    private config: ConfigType<typeof configuration>,
  ) {
    mercadopago.configure({
      access_token: config.mercadopago.accessToken,
    });
  }

  validateWebhookSignature(
    xSignature: string,
    xRequestId: string,
    dataId: string,
  ): boolean {
    // In development without a real secret configured, skip validation
    if (!xSignature || !this.config.mercadopago.webhookSecret) return true;

    // Parse ts and v1 from header: "ts=<timestamp>,v1=<hash>"
    const parts = Object.fromEntries(
      xSignature.split(',').map((p) => p.split('=')),
    );
    const ts = parts['ts'];
    const v1 = parts['v1'];
    if (!ts || !v1) return false;

    const manifest = `id:${dataId ?? ''};request-id:${xRequestId ?? ''};ts:${ts};`;
    const expected = createHmac('sha256', this.config.mercadopago.webhookSecret)
      .update(manifest)
      .digest('hex');

    return expected === v1;
  }

  async createPreference(dto: CreatePreferenceDto) {
    const { sessionId, plan, email, userName } = dto;

    // Use upsert to handle race conditions where multiple requests
    // hit this endpoint with the same sessionId simultaneously.
    const payment = await this.prisma.payment.upsert({
      where: { sessionId },
      update: {},
      create: {
        sessionId,
        plan,
        email: email ?? null,
        userName: userName ?? null,
        status: 'pending',
      },
    });

    const planPrices = PLAN_PRICES[plan];
    const amountArs = planPrices.ars;
    if (amountArs === null) {
      throw new ForbiddenException(`Plan ${plan} does not have a fixed price in ARS`);
    }

    const preference = {
      items: [
        {
          title: 'Test Vocacional Profesional',
          quantity: 1,
          unit_price: amountArs,
          currency_id: 'ARS',
        },
      ],
      external_reference: sessionId,
      notification_url: `${this.config.app.url}/api/payment/webhook`,
    };

    const response = await mercadopago.preferences.create(preference);
    const { init_point, sandbox_init_point, id } = response.body;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { mpPreferenceId: id },
    });

    return {
      preferenceId: id,
      initPoint: init_point,
      sandboxInitPoint: sandbox_init_point,
    };
  }

  async handleWebhook(notification: WebhookNotificationDto) {
    // Support both MP API v1 (type/data.id) and legacy IPN (topic/id)
    const isPaymentEvent =
      notification.type === 'payment' || notification.topic === 'payment';
    if (!isPaymentEvent) {
      return { received: true };
    }

    // v1: data.id contains the MP payment ID; v0: id at root
    const rawPaymentId = notification.data?.id ?? notification.id;
    if (!rawPaymentId) {
      return { received: true };
    }

    // Fetch payment details from MP to get the real status and external_reference
    let paymentId = rawPaymentId;
    let externalReference = notification.external_reference;
    let status = notification.status;

    try {
      const response = await mercadopago.payment.get(rawPaymentId);
      paymentId = String(response.body.id);
      status = response.body.status;
      externalReference = response.body.external_reference ?? externalReference;
    } catch {
      // If we can't fetch from MP, proceed with what came in the notification
    }

    let paymentStatus: string;
    switch (status) {
      case 'approved':   paymentStatus = 'approved';   break;
      case 'pending':    paymentStatus = 'pending';    break;
      case 'rejected':   paymentStatus = 'rejected';   break;
      case 'cancelled':  paymentStatus = 'cancelled';  break;
      case 'in_process': paymentStatus = 'in_process'; break;
      default:           paymentStatus = 'pending';
    }

    await this.prisma.payment.updateMany({
      where: {
        OR: [
          { mpPaymentId: paymentId },
          { sessionId: externalReference },
        ],
      },
      data: { status: paymentStatus as 'pending', mpPaymentId: paymentId },
    });

    if (paymentStatus === 'approved' && externalReference) {
      const paymentRecord = await this.prisma.payment.findUnique({
        where: { sessionId: externalReference },
      });
      if (paymentRecord?.email) {
        await this.mailService.sendPaymentConfirmation(
          paymentRecord.email,
          paymentRecord.userName ?? null,
        );
      }
    }

    return { received: true };
  }

  async processPayment(dto: ProcessPaymentDto) {
    const { sessionId, ...paymentData } = dto;

    const response = await mercadopago.payment.create({
      transaction_amount: paymentData.transaction_amount,
      token: paymentData.token,
      installments: paymentData.installments,
      payment_method_id: paymentData.payment_method_id,
      issuer_id: paymentData.issuer_id ? String(paymentData.issuer_id) as unknown as number : undefined,
      payer: paymentData.payer,
      description: 'Test Vocacional Profesional',
      external_reference: sessionId,
      notification_url: `${this.config.app.url}/api/payment/webhook`,
    });

    const { id, status } = response.body;
    const mpPaymentId = String(id);

    const normalizedStatus =
      status === 'approved' ? 'approved'
      : status === 'rejected' ? 'rejected'
      : status === 'cancelled' ? 'cancelled'
      : status === 'in_process' ? 'in_process'
      : 'pending';

    await this.prisma.payment.updateMany({
      where: { sessionId },
      data: { status: normalizedStatus as 'pending', mpPaymentId },
    });

    if (normalizedStatus === 'approved') {
      const paymentRecord = await this.prisma.payment.findUnique({ where: { sessionId } });
      if (paymentRecord?.email) {
        await this.mailService.sendPaymentConfirmation(paymentRecord.email, paymentRecord.userName ?? null);
      }
    }

    return { paymentId: id, status: normalizedStatus };
  }

  async checkPaymentBySession(sessionId: string): Promise<{ approved: boolean }> {
    const payment = await this.prisma.payment.findUnique({ where: { sessionId } });
    return { approved: payment?.status === 'approved' };
  }
}
