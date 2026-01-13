import { User } from '@/modules/user/model';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

enum InterestedInEnum {
  MEN = 'men',
  WOMEN = 'women',
  EVERYONE = 'everyone',
}

enum LookingForEnum {
  LONG_TERM = 'long_term',
  SHORT_TERM = 'short_term',
  FRIENDSHIP = 'friendship',
  NOT_SURE = 'not_sure',
}

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
