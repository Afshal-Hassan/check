import { User } from '@/modules/user/model';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

enum SmokingEnum {
  NEVER = 'never',
  SOCIALLY = 'socially',
  REGULARLY = 'regularly',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

enum PoliticalEnum {
  LIBERAL = 'liberal',
  MODERATE = 'moderate',
  CONSERVATIVE = 'conservative',
  NOT_POLITICAL = 'not_political',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

enum DietEnum {
  OMNIVORE = 'omnivore',
  VEGETARIAN = 'vegetarian',
  PESCATARIAN = 'pescatarian',
  KETO = 'keto',
  OTHER = 'other',
}

enum WorkoutEnum {
  DAILY = 'daily',
  THREE_FOUR_WEEK = 'three_four_week',
  ONE_TWO_WEEK = 'one_two_week',
  RARELY = 'rarely',
  NEVER = 'never',
}

@Entity('lifestyle_preferences')
export class LifestylePreference {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column({ name: 'smoking', type: 'varchar', length: 32 })
  smoking!: SmokingEnum;

  @Column({ name: 'political_views', type: 'varchar', length: 32 })
  politicalViews!: PoliticalEnum;

  @Column({ name: 'diet', type: 'varchar', length: 32 })
  diet!: DietEnum;

  @Column({ name: 'workout_routine', type: 'varchar', length: 32 })
  workoutRoutine!: WorkoutEnum;
}
