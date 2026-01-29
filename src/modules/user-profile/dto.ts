import { Transform } from 'class-transformer';
import { BodyTypeEnum, ChildrenEnum, HeightUnit, RelationshipStatusEnum } from './enums';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNumber({}, { message: 'Height should be a number' })
  @IsNotEmpty({ message: 'Height is required' })
  height!: number;

  @IsEnum(HeightUnit, {
    message: `Height unit must be one of: ${Object.values(HeightUnit).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Height unit is required' })
  unit!: HeightUnit;

  @IsArray({ message: 'Languages must be an array' })
  @ArrayNotEmpty({ message: 'At least one interest is required' })
  @IsString({ each: true, message: 'Each language must be a string' })
  @IsNotEmpty({ each: true, message: 'Each language is required' })
  @Transform(({ value }) => value?.map((v: any) => v?.trim()?.toLowerCase()))
  languages!: string[];
}
