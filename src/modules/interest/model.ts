import { User } from '@/modules/user/model';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => User, (user) => user.interests, { nullable: false, onDelete: 'CASCADE' })
  users!: User[];
}
