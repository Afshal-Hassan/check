import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class PromptItemDTO {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: string;

  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  promptId!: string;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'Answer must be a string' })
  @IsNotEmpty({ message: 'Answer is required' })
  @MaxLength(1000, { message: 'Answer must be at most 1000 characters' })
  answer!: string;
}

export class SavePromptDTO {
  @IsDefined({ message: 'Prompts are required' })
  @IsArray({ message: 'Prompts must be an array' })
  @ArrayMinSize(1, { message: 'At least one prompt is required' })
  @ValidateNested({ each: true })
  @Type(() => PromptItemDTO)
  prompts!: PromptItemDTO[];
}
