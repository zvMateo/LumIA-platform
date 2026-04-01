// src/modules/payment/dto/create-preference.dto.ts
import { IsUUID, IsOptional, IsString } from 'class-validator';
import { Plan } from '@shared/index';

export class CreatePreferenceDto {
  @IsUUID()
  sessionId: string;

  @IsString()
  plan: Plan;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  userName?: string | null;
}
