import { User } from '@/modules/user/model';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { DietEnum, PoliticalEnum, SmokingEnum, WorkoutEnum } from './enums';

@Entity('lifestyle_preferences')
export class LifestylePreference {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column({ name: 'smoking', nullable: true, type: 'varchar', length: 32 })
  smoking!: SmokingEnum;

  @Column({ name: 'political_views', nullable: true, type: 'varchar', length: 32 })
  politicalViews!: PoliticalEnum;

  @Column({ name: 'diet', nullable: true, type: 'varchar', length: 32 })
  diet!: DietEnum;

  @Column({ name: 'workout_routine', nullable: true, type: 'varchar', length: 32 })
  workoutRoutine!: WorkoutEnum;
}
