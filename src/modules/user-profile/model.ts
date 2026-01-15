import { User } from '@/modules/user/model';
import { GenderEnum, BodyTypeEnum, ChildrenEnum, RelationshipStatusEnum } from './enums';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column({ name: 'bio_en' })
  bioEn!: string;

  @Column({ name: 'bio_fr' })
  bioFr!: string;

  @Column({ name: 'bio_sp' })
  bioSp!: string;

  @Column({ name: 'bio_ar' })
  bioAr!: string;

  @Column({ name: 'height_en', nullable: true })
  heightEn!: string;

  @Column({ name: 'height_fr', nullable: true })
  heightFr!: string;

  @Column({ name: 'height_sp', nullable: true })
  heightSp!: string;

  @Column({ name: 'height_ar', nullable: true })
  heightAr!: string;

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
}
