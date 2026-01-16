import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserPromptDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsString()
  @IsNotEmpty()
  answer!: string;
}
