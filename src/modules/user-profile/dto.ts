import { GenderEnum } from '@/constants';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BodyTypeEnum, ChildrenEnum, RelationshipStatusEnum } from './enums';
import { Relation } from 'typeorm';

export class UserProfileDTO {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  bio!: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth!: Date;

  @IsString()
  @IsNotEmpty()
  occupation!: string;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender!: GenderEnum;
}

export class PersonalDetailsDTO {
  @IsEnum(BodyTypeEnum)
  @IsNotEmpty()
  bodyType!: BodyTypeEnum;

  @IsEnum(RelationshipStatusEnum)
  @IsNotEmpty()
  relationshipStatus!: RelationshipStatusEnum;

  @IsEnum(ChildrenEnum)
  @IsNotEmpty()
  childrenPreference!: ChildrenEnum;

  @IsNumber()
  @IsNotEmpty()
  heightCm!: number;
}
