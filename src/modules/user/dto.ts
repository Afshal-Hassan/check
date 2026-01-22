import { GenderEnum } from '@/constants';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  MaxLength,
  IsDateString,
  IsEnum,
  IsArray,
  IsDefined,
  ArrayNotEmpty,
  MinLength,
} from 'class-validator';

class LocationDTO {
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country is required' })
  country!: string;

  @Transform(({ value }) => value?.trim())
  city!: string;

  @Transform(({ value }) => value?.trim())
  state!: string;
}

class ProfileDTO {
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Bio must be a string' })
  @IsNotEmpty({ message: 'Bio is required' })
  @MinLength(20, { message: 'Bio must be atleast 20 characters' })
  @MaxLength(500, { message: 'Bio must be at most 500 characters' })
  bio!: string;

  @IsDateString({}, { message: 'Date of Birth must be a valid date string' })
  @IsNotEmpty({ message: 'Date of Birth is required' })
  dateOfBirth!: Date;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Occupation must be a string' })
  @IsNotEmpty({ message: 'Occupation is required' })
  occupation!: string;

  @IsEnum(GenderEnum, { message: `Gender must be one of: ${Object.values(GenderEnum).join(', ')}` })
  @IsNotEmpty({ message: 'Gender is required' })
  gender!: GenderEnum;
}

export class OnboardingDTO {
  @IsDefined({ message: 'Location is required' })
  @ValidateNested()
  @Type(() => LocationDTO)
  location!: LocationDTO;

  @IsDefined({ message: 'Profile is required' })
  @ValidateNested()
  @Type(() => ProfileDTO)
  profile!: ProfileDTO;

  @IsArray({ message: 'Interests must be an array' })
  @ArrayNotEmpty({ message: 'At least one interest is required' })
  @IsString({ each: true, message: 'Each interest must be a string' })
  @IsNotEmpty({ each: true, message: 'Each interest is required' })
  @Transform(({ value }) => value?.map((v: any) => v?.trim()?.toLowerCase()))
  interests!: string[];
}
