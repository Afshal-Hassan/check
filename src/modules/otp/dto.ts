import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
