import { User } from '@/modules/user/model';
import { GenderEnum, BodyTypeEnum, ChildrenEnum, RelationshipStatusEnum } from './enums';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column({ name: 'bio_en', type: 'text' })
  bioEn!: string;

  @Column({ name: 'bio_fr', type: 'text' })
  bioFr!: string;

  @Column({ name: 'bio_sp', type: 'text' })
  bioSp!: string;

  @Column({ name: 'bio_ar', type: 'text' })
  bioAr!: string;

  @Column({ name: 'height_en', type: 'varchar', length: 32, nullable: true })
  heightEn!: string;

  @Column({ name: 'height_fr', type: 'varchar', length: 32, nullable: true })
  heightFr!: string;

  @Column({ name: 'height_sp', type: 'varchar', length: 32, nullable: true })
  heightSp!: string;

  @Column({ name: 'height_ar', type: 'varchar', length: 32, nullable: true })
  heightAr!: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth!: Date;

  @Column({ name: 'occupation', type: 'varchar', length: 32 })
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
