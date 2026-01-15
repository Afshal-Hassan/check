import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class InterestDTO {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  interests!: string[];
}
