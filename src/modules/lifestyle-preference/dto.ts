import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { DietEnum, PoliticalEnum, SmokingEnum, WorkoutEnum } from './enums';

export class LifestylePreferenceDTO {
  @IsEnum(SmokingEnum, {
    message: `Smoking preference must be one of: ${Object.values(SmokingEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Smoking preference is required' })
  smoking!: SmokingEnum;

  @IsEnum(PoliticalEnum, {
    message: `Political views must be one of: ${Object.values(PoliticalEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Political views are required' })
  politicalViews!: PoliticalEnum;

  @IsEnum(DietEnum, { message: `Diet must be one of: ${Object.values(DietEnum).join(', ')}` })
  @IsNotEmpty({ message: 'Diet preference is required' })
  diet!: DietEnum;

  @IsEnum(WorkoutEnum, {
    message: `Workout routine must be one of: ${Object.values(WorkoutEnum).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Workout routine is required' })
  workoutRoutine!: WorkoutEnum;
}
