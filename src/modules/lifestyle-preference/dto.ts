import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DietEnum, PoliticalEnum, SmokingEnum, WorkoutEnum } from './enums';

export class LifestylePreferenceDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(SmokingEnum)
  @IsNotEmpty()
  smoking: SmokingEnum;

  @IsEnum(PoliticalEnum)
  @IsNotEmpty()
  politicalViews: PoliticalEnum;

  @IsEnum(DietEnum)
  @IsNotEmpty()
  diet: DietEnum;

  @IsEnum(WorkoutEnum)
  @IsNotEmpty()
  workoutRoutine: WorkoutEnum;
}
