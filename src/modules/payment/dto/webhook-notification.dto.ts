// src/modules/payment/dto/webhook-notification.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class WebhookNotificationDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  application_id?: string;

  @IsString()
  @IsOptional()
  external_reference?: string; // This is our sessionId

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  status_detail?: string;

  @IsString()
  @IsOptional()
  merchant_order_id?: string;

  @IsString()
  @IsOptional()
  preference_id?: string;

  @IsString()
  @IsOptional()
  site_id?: string;

  @IsString()
  @IsOptional()
  integrator_id?: string;

  @IsString()
  @IsOptional()
  point_of_sale_id?: string;

  @IsString()
  @IsOptional()
  sponsor_id?: string;
}
