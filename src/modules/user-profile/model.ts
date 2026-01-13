import { User } from '@/modules/user/model';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

enum BodyTypeEnum {
  SLIM = 'slim',
  ATHLETIC = 'athletic',
  AVERAGE = 'average',
  CURVY = 'curvy',
  MUSCULAR = 'muscular',
  PLUS_SIZE = 'plus_size',
}

enum RelationshipStatusEnum {
  SINGLE = 'single',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
}

enum ChildrenEnum {
  YES = 'yes',
  NO = 'no',
  MAYBE = 'maybe',
  OPEN_TO_DISCUSSION = 'open_to_discussion',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column({ name: 'bio', nullable: true })
  bio!: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth!: Date;

  @Column({ name: 'occupation' })
  occupation!: string;

  @Column({ name: 'gender', type: 'varchar', length: 32 })
  gender!: GenderEnum;

  @Column({ name: 'height_cm' })
  heightCm!: number;

  @Column({ name: 'body_type', type: 'varchar', length: 32 })
  bodyType!: BodyTypeEnum;

  @Column({
    name: 'relationship_status',
    type: 'varchar',
    length: 32,
  })
  relationshipStatus!: RelationshipStatusEnum;

  @Column({ name: 'children_preference', type: 'varchar', length: 32 })
  childrenPreference!: ChildrenEnum;
}
