import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class InterestDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  interests!: string[];
}
