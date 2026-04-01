import { IsString, IsOptional, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// MP Webhooks API v1 format (current):
// { type: "payment", action: "payment.updated", data: { id: "123" }, ... }
//
// MP IPN/Notifications legacy format (v0):
// { topic: "payment", id: "123", resource: "/v1/payments/123", ... }

class WebhookDataDto {
  @IsOptional()
  @IsString()
  id?: string;
}

export class WebhookNotificationDto {
  // v1 fields
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  api_version?: string;

  @IsOptional()
  @IsString()
  date_created?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookDataDto)
  data?: WebhookDataDto;

  // v0 / legacy IPN fields
  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  resource?: string;

  // Common fields
  @IsOptional()
  @IsString()
  external_reference?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  live_mode?: boolean;
}
