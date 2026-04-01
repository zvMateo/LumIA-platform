import { Controller, Post, Body, Get, Param, HttpCode, Headers, Query, UnauthorizedException } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { PaymentService } from './payment.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { WebhookNotificationDto } from './dto/webhook-notification.dto';

@Throttle({ default: { limit: 10, ttl: 60_000 } })
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-preference')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async createPreference(@Body() dto: CreatePreferenceDto) {
    return this.paymentService.createPreference(dto);
  }

  @Post('process')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async processPayment(@Body() dto: ProcessPaymentDto) {
    return this.paymentService.processPayment(dto);
  }

  @Post('webhook')
  @SkipThrottle()
  @HttpCode(200)
  async handleWebhook(
    @Body() notification: WebhookNotificationDto,
    @Headers('x-signature') xSignature: string,
    @Headers('x-request-id') xRequestId: string,
    @Query('data.id') dataId: string,
  ) {
    const valid = this.paymentService.validateWebhookSignature(
      xSignature,
      xRequestId,
      dataId,
    );
    if (!valid) throw new UnauthorizedException('Invalid webhook signature');

    return this.paymentService.handleWebhook(notification);
  }

  @Get('status/:sessionId')
  async checkPaymentBySession(@Param('sessionId') sessionId: string) {
    return this.paymentService.checkPaymentBySession(sessionId);
  }
}
