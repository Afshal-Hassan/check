import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role, SocialProvider } from './enums';

export class SignupDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}

export class CompleteSignupDto {
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName!: string;

  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;

  @IsNumber({}, { message: 'OTP must be a number' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Min(100000, { message: 'OTP must be a 6-digit number' })
  @Max(999999, { message: 'OTP must be a 6-digit number' })
  otp!: number;
}

export class LoginDto {
  /**
   * User's email address.
   * Required when logging in via email/password (i.e., when `provider` is not provided).
   */
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ValidateIf((o) => !o.provider)
  @IsEmail()
  email!: string;

  /**
   * User's password.
   * Required when logging in via email/password (i.e., when `provider` is not provided).
   * Must be 8–100 characters long and include at least one uppercase letter,
   * one lowercase letter, one number, and one special character.
   */
  @ValidateIf((o) => !o.provider)
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;

  /**
   * User's role.
   * Required when logging in via email/password (i.e., when `provider` is not provided).
   * Must match one of the predefined enum values (e.g., 'admin', 'user').
   */
  @ValidateIf((o) => !o.provider)
  @IsEnum(Role, { message: 'Role must be one of admin, user' })
  @IsNotEmpty({ message: 'Role is required' })
  role!: Role;

  /**
   * Optional social login provider.
   * If provided, login will be performed using the specified provider instead of email/password.
   */
  @IsOptional()
  @IsEnum(SocialProvider)
  provider!: SocialProvider;

  /**
   * Social login token.
   * Required if a social `provider` is specified.
   */
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
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword!: string;

  @IsNumber({}, { message: 'OTP must be a number' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Min(100000, { message: 'OTP must be a 6-digit number' })
  @Max(999999, { message: 'OTP must be a 6-digit number' })
  otp!: number;
}
