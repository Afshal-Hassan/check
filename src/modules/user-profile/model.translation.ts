import { UserProfile } from './model';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_profile_translations')
export class UserProfileTranslation {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userProfile?: UserProfile;

  @Column({ name: 'language_code', type: 'varchar', length: 5 })
  languageCode!: string;

  @Column({ name: 'bio' })
  bio!: string;

  @Column({ name: 'height_cm', nullable: true })
  heightCm!: number;
}
