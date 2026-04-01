// src/modules/payment/payment.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import mercadopago from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';
import configuration from '../shared/config/configuration';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { WebhookNotificationDto } from './dto/webhook-notification.dto';
import { PaymentStatus, Plan } from '@shared/index';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    @Inject(configuration.KEY)
    private config: ConfigType<typeof configuration>,
  ) {
    mercadopago.configure({
      access_token: config.mercadopago.accessToken,
    });
  }

  async createPreference(dto: CreatePreferenceDto) {
    const { sessionId, plan, email, userName } = dto;

    // Check if a payment record already exists for this session
    let payment = await this.prisma.payment.findUnique({
      where: { sessionId },
    });

    // If not, create a new one with status 'pending'
    if (!payment) {
      payment = await this.prisma.payment.create({
        data: {
          sessionId,
          plan,
          email: email ?? null,
          userName: userName ?? null,
          status: PaymentStatus.pending,
        },
      });
    }

    // Determine the amount in ARS
    const amountArs = PLAN_PRICES[plan].ars;
    if (amountArs === null) {
      throw new Error(`Plan ${plan} does not have a fixed price in ARS`);
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
      back_urls: {
        success: `${this.config.app.url}/pago/exitoso`,
        failure: `${this.config.app.url}/pago/error`,
        pending: `${this.config.app.url}/pago/pendiente`,
      },
      auto_return: 'approved',
      external_reference: sessionId,
      notification_url: `${this.config.app.url}:${this.config.app.port}/payment/webhook`,
    };

    const response = await mercadopago.preferences.create(preference);
    const { init_point, sandbox_init_point, id } = response.body;

    // Update the payment record with the preference ID
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        mpPreferenceId: id,
      },
    });

    return {
      preferenceId: id,
      initPoint: init_point,
      sandboxInitPoint: sandbox_init_point,
    };
  }

  async handleWebhook(notification: WebhookNotificationDto) {
    // We are only interested in payment notifications
    if (notification.topic !== 'payment') {
      return { received: true };
    }

    const paymentId = notification.id;
    const externalReference = notification.external_reference; // This is our sessionId
    const status = notification.status;

    // Map MercadoPago status to our PaymentStatus
    let paymentStatus: PaymentStatus;
    switch (status) {
      case 'approved':
        paymentStatus = PaymentStatus.approved;
        break;
      case 'pending':
        paymentStatus = PaymentStatus.pending;
        break;
      case 'rejected':
        paymentStatus = PaymentStatus.rejected;
        break;
      case 'cancelled':
        paymentStatus = PaymentStatus.cancelled;
        break;
      case 'in_process':
        paymentStatus = PaymentStatus.in_process;
        break;
      default:
        paymentStatus = PaymentStatus.pending;
    }

    // Update the payment record
    const payment = await this.prisma.payment.updateMany({
      where: {
        mpPaymentId: paymentId,
        sessionId: externalReference,
      },
      data: {
        status: paymentStatus,
        mpPaymentId: paymentId, // Ensure it's set (though it should be from the external_reference we set)
      },
    });

    // If payment is approved, we can optionally send a welcome email here
    // (but according to the instructions, the n8n workflow sends the vocational report)
    // We are only to send transactional emails: confirmation of payment and welcome post-registration.
    // We'll send a payment confirmation email here if the status is approved.
    if (paymentStatus === PaymentStatus.approved) {
      // TODO: Send email using Resend (or nodemailer as per instructions)
      // For now, we'll just log. We'll implement the email service later.
      console.log(`Payment approved for sessionId: ${externalReference}`);
      // We could also update the user's plan if needed, but the plan is already set in the payment.
    }

    return { received: true };
  }

  async checkPaymentBySession(sessionId: string): Promise<{ approved: boolean }> {
    const payment = await this.prisma.payment.findUnique({
      where: { sessionId },
    });

    return {
      approved: payment?.status === PaymentStatus.approved,
    };
  }
}

// Define the plan prices constant (shared with frontend)
const PLAN_PRICES = {
  b2c: { ars: 2990, usd: 3, label: 'Estudiante' },
  b2b: { ars: 24900, usd: 25, label: 'Institución' },
  b2b2c: { ars: null, usd: null, label: 'Empresa' },
} as const;
