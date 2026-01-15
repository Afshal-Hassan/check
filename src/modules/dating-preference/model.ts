import { User } from '@/modules/user/model';
import { InterestedInEnum, LookingForEnum } from './enums';
import { Check, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Check(`"min_age" BETWEEN 18 AND 100`)
@Check(`"max_age" BETWEEN 18 AND 100`)
@Check(`"max_age" >= "min_age"`)
@Entity('dating_preferences')
export class DatingPreference {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column({ name: 'min_age' })
  minAge!: number;

  @Column({ name: 'max_age' })
  maxAge!: number;

  @Column({ name: 'max_distance_km' })
  maxDistanceKm!: number;

  @Column({ name: 'interested_in', type: 'varchar', length: 32 })
  interestedIn!: InterestedInEnum;

  @Column({ name: 'looking_for', type: 'varchar', length: 32 })
  lookingFor!: LookingForEnum;
}
