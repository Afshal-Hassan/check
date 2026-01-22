import { Transform } from 'class-transformer';
import { BodyTypeEnum, ChildrenEnum, RelationshipStatusEnum } from './enums';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class PersonalDetailsDTO {
  @IsEnum(BodyTypeEnum, {
    message: `Body type must be one of: ${Object.values(BodyTypeEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Body type is required' })
  bodyType!: BodyTypeEnum;

  @IsEnum(RelationshipStatusEnum, {
    message: `Relationship status must be one of: ${Object.values(RelationshipStatusEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Relationship status is required' })
  relationshipStatus!: RelationshipStatusEnum;

  @IsEnum(ChildrenEnum, {
    message: `Children preference must be one of: ${Object.values(ChildrenEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Children preference is required' })
  childrenPreference!: ChildrenEnum;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Height must be a string' })
  @IsNotEmpty({ message: 'Height is required' })
  @MaxLength(10, { message: 'Height must be at most 10 characters' })
  height!: string;

  @IsArray({ message: 'Languages must be an array' })
  @ArrayNotEmpty({ message: 'At least one interest is required' })
  @IsString({ each: true, message: 'Each language must be a string' })
  @IsNotEmpty({ each: true, message: 'Each language is required' })
  @Transform(({ value }) => value?.map((v: any) => v?.trim()?.toLowerCase()))
  languages!: string[];
}
