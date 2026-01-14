import { OtpAction } from '@/constants';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsEnum(OtpAction)
  action!: OtpAction;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}

export class ResendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsEnum(OtpAction)
  action!: OtpAction;
}
