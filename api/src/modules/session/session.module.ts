import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
