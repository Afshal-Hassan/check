import { InterestedInEnum, LookingForEnum } from './enums';
import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class DatingPreferenceDTO {
  @IsInt({ message: 'Minimum age must be an integer' })
  @Min(18, { message: 'Minimum age must be at least 18' })
  @Max(80, { message: 'Minimum age cannot exceed 80' })
  minAge!: number;

  @IsInt({ message: 'Maximum age must be an integer' })
  @Min(18, { message: 'Maximum age must be at least 18' })
  @Max(80, { message: 'Maximum age cannot exceed 80' })
  maxAge!: number;

  @IsEnum(InterestedInEnum, {
    message: `InterestedIn must be one of: ${Object.values(InterestedInEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'InterestedIn field is required' })
  interestedIn!: InterestedInEnum;

  @IsEnum(LookingForEnum, {
    message: `LookingFor must be one of: ${Object.values(LookingForEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'LookingFor field is required' })
  lookingFor!: LookingForEnum;
}
