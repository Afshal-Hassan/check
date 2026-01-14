import { Interest } from '@/modules/interest/model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ unique: true, name: 'email' })
  email!: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash!: string;

  @Column({ name: 'country', nullable: true })
  country!: string;

  @Column({ name: 'city', nullable: true })
  city!: string;

  @Column({ name: 'state', nullable: true })
  state!: string;

  @Column({ default: true, name: 'is_verified' })
  isVerified!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToMany(() => Interest, (interest) => interest.users, { cascade: true })
  @JoinTable({
    name: 'user_interests',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
  })
  interests!: Interest[];
}
