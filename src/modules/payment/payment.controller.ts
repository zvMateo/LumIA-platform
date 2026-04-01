// src/modules/payment/payment.controller.ts
import { Controller, Post, Body, Get, Param, HttpCode, Header } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { WebhookNotificationDto } from './dto/webhook-notification.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-preference')
  async createPreference(@Body() dto: CreatePreferenceDto) {
    return this.paymentService.createPreference(dto);
  }

  // MercadoPago webhook endpoint (no authentication, but we should verify the signature in a real app)
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() notification: WebhookNotificationDto) {
    return this.paymentService.handleWebhook(notification);
  }

  @Get('status/:sessionId')
  async checkPaymentBySession(@Param('sessionId') sessionId: string) {
    return this.paymentService.checkPaymentBySession(sessionId);
  }
}
