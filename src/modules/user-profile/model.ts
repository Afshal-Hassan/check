import { GenderEnum } from '@/constants';
import { User } from '@/modules/user/model';
import { UserProfileTranslation } from './model.translation';
import { BodyTypeEnum, ChildrenEnum, RelationshipStatusEnum } from './enums';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth!: Date;

  @Column({ name: 'occupation' })
  occupation!: string;

  @Column({ name: 'gender', type: 'varchar', length: 32 })
  gender!: GenderEnum;

  @Column({ name: 'body_type', type: 'varchar', length: 32, nullable: true })
  bodyType!: BodyTypeEnum;

  @Column({
    name: 'relationship_status',
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  relationshipStatus!: RelationshipStatusEnum;

  @Column({ name: 'children_preference', type: 'varchar', length: 32, nullable: true })
  childrenPreference!: ChildrenEnum;

  @OneToMany(() => UserProfileTranslation, (translation) => translation.userProfile, {
    cascade: true,
  })
  translations!: UserProfileTranslation[];
}
