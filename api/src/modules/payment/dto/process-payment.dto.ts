import { IsString, IsNumber, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class PayerIdentificationDto {
  @IsString() type: string;
  @IsString() number: string;
}

class PayerDto {
  @IsString() email: string;
  @IsOptional() @ValidateNested() @Type(() => PayerIdentificationDto)
  identification?: PayerIdentificationDto;
}

export class ProcessPaymentDto {
  @IsString() sessionId: string;
  @IsNumber() transaction_amount: number;
  @IsString() token: string;
  @IsNumber() installments: number;
  @IsString() payment_method_id: string;
  @IsOptional() issuer_id?: number | string;
  @IsObject() @ValidateNested() @Type(() => PayerDto)
  payer: PayerDto;
}
