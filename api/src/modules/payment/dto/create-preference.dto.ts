import { IsUUID, IsOptional, IsString, IsIn } from 'class-validator';
import { Plan } from '@voctest/shared';

export class CreatePreferenceDto {
  @IsUUID()
  sessionId: string;

  @IsString()
  @IsIn(['b2c', 'b2b', 'b2b2c'])
  plan: Plan;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  userName?: string | null;
}
