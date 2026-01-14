import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  action!: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}

export class ResendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  action!: string;
}
