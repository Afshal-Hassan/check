import { OtpAction } from '@/constants';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyOtpDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsNotEmpty({ message: 'OTP Action is required' })
  @IsEnum(OtpAction, { message: `Action must be one of: ${Object.values(OtpAction).join(', ')}` })
  action!: OtpAction;

  @IsNotEmpty({ message: 'OTP is required' })
  @IsNumber({}, { message: 'OTP must be a number' })
  otp!: number;
}

export class ResendOtpDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsNotEmpty({ message: 'OTP Action is required' })
  @IsEnum(OtpAction, { message: `Action must be one of: ${Object.values(OtpAction).join(', ')}` })
  action!: OtpAction;
}
