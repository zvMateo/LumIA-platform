import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MailService } from './mail.service';

@Module({
  imports: [PrismaModule],
  providers: [PaymentService, MailService],
  controllers: [PaymentController],
})
export class PaymentModule {}
