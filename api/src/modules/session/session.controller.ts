import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { SessionService } from './session.service';
import { ChatRequest, ChatResponse } from '@voctest/shared';

@Throttle({ default: { limit: 5, ttl: 60_000 } })
@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async sendMessage(@Body() dto: ChatRequest): Promise<ChatResponse> {
    return this.sessionService.sendMessage(dto);
  }

  @Post('status')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async getStatus(@Body() body: { sessionId: string }) {
    return this.sessionService.getStatus(body.sessionId);
  }
}
