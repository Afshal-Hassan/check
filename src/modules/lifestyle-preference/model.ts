import { User } from '@/modules/user/model';
import { DietEnum, PoliticalEnum, SmokingEnum, WorkoutEnum } from './enums';
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_lifestyle_user_id', ['user'])
@Entity('lifestyle_preferences')
export class LifestylePreference {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
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
