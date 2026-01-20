import { Type, Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
  MaxLength,
  IsDefined,
  ArrayNotEmpty,
} from 'class-validator';

export class PromptItemDTO {
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Question must be a string' })
  @IsNotEmpty({ message: 'Question is required' })
  @MaxLength(500, { message: 'Question must be at most 500 characters' })
  question!: string;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Answer must be a string' })
  @IsNotEmpty({ message: 'Answer is required' })
  @MaxLength(1000, { message: 'Answer must be at most 1000 characters' })
  answer!: string;
}

export class PromptDTO {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: string;

  @IsDefined({ message: 'prompts are required' })
  @IsArray({ message: 'Prompts must be an array' })
  @ArrayNotEmpty({ message: 'At least one interest is required' })
  @ArrayMinSize(1, { message: 'At least one prompt is required' })
  @ValidateNested({ each: true })
  @Type(() => PromptItemDTO)
  prompts!: PromptItemDTO[];
}
