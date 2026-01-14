import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { SocialProvider } from './enums';

export class OtpVerificationDto {
  @IsNotEmpty()
  @IsNumber()
  otp: number;
}

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class UserDto {
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

  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(50)
  // country!: string;

  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(50)
  // city!: string;

  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(50)
  // state!: string;
}

export class LoginDto {
  @ValidateIf((o) => !o.provider)
  @IsEmail()
  email!: string;

  @ValidateIf((o) => !o.provider)
  @IsString()
  password!: string;

  @IsOptional()
  @IsEnum(SocialProvider)
  provider!: SocialProvider;

  @ValidateIf((o) => o.provider)
  @IsString()
  @IsNotEmpty()
  socialToken!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword!: string;
}
