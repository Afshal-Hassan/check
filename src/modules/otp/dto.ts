import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupVerificationDto {
  @IsNotEmpty()
  @IsEmail()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  country!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  city!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  state!: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}

export class ResendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
