import { InterestedInEnum, LookingForEnum } from './enums';
import { IsEnum, IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class DatingPreferenceDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsInt()
  @Min(18)
  @Max(80)
  minAge!: number;

  @IsInt()
  @Min(18)
  @Max(80)
  maxAge!: number;

  @IsInt()
  @Min(1)
  maxDistanceKm!: number;

  @IsEnum(InterestedInEnum)
  @IsNotEmpty()
  interestedIn!: InterestedInEnum;

  @IsEnum(LookingForEnum)
  @IsNotEmpty()
  lookingFor!: LookingForEnum;
}
