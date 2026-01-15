import { GenderEnum, BodyTypeEnum, ChildrenEnum, RelationshipStatusEnum } from './enums';
import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UserProfileDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
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
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(BodyTypeEnum)
  @IsNotEmpty()
  bodyType!: BodyTypeEnum;

  @IsEnum(RelationshipStatusEnum)
  @IsNotEmpty()
  relationshipStatus!: RelationshipStatusEnum;

  @IsEnum(ChildrenEnum)
  @IsNotEmpty()
  childrenPreference!: ChildrenEnum;

  @IsString()
  @IsNotEmpty()
  height!: string;
}
