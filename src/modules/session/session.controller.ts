// src/modules/session/session.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SessionService } from './session.service';
import { ChatRequest, ChatResponse } from '@shared/index';

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('chat')
  async sendMessage(@Body() dto: ChatRequest): Promise<ChatResponse> {
    return this.sessionService.sendMessage(dto);
  }

  @Post('status')
  async getStatus(@Body() { sessionId }: { sessionId: string }) {
    return this.sessionService.getStatus(sessionId);
  }
}
