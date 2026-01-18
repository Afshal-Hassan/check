import { Role } from '@/modules/role/model';
import { Interest } from '@/modules/interest/model';
import { Language } from '@/modules/language/model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 32 })
  fullName!: string;

  @Column({ unique: true, name: 'email', type: 'text' })
  email!: string;

  @Column({ name: 'password_hash', nullable: true, type: 'text' })
  passwordHash!: string;

  @Column({ name: 'auth_type', type: 'varchar', length: 32 })
  authType!: string;

  @Column({ name: 'country', nullable: true, type: 'varchar', length: 32 })
  country!: string;

  @Column({ name: 'city', nullable: true, type: 'varchar', length: 32 })
  city!: string;

  @Column({ name: 'state', nullable: true, type: 'varchar', length: 32 })
  state!: string;

  @Column({ default: false, name: 'is_verified' })
  isVerified!: boolean;

  @Column({ default: false, name: 'is_suspended' })
  isSuspended!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role!: Role;

  @ManyToMany(() => Interest, (interest) => interest.users, { cascade: true })
  @JoinTable({
    name: 'user_interests',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
  })
  interests!: Interest[];

  @ManyToMany(() => Language, (language) => language.users, { cascade: true })
  @JoinTable({
    name: 'user_languages',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'language_id', referencedColumnName: 'id' },
  })
  languages!: Language[];
}
