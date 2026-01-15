import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { DietEnum, PoliticalEnum, SmokingEnum, WorkoutEnum } from './enums';

export class LifestylePreferenceDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(SmokingEnum)
  @IsNotEmpty()
  smoking!: SmokingEnum;

  @IsEnum(PoliticalEnum)
  @IsNotEmpty()
  politicalViews!: PoliticalEnum;

  @IsEnum(DietEnum)
  @IsNotEmpty()
  diet!: DietEnum;

  @IsEnum(WorkoutEnum)
  @IsNotEmpty()
  workoutRoutine!: WorkoutEnum;
}
