// src/modules/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
