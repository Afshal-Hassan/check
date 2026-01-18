import { User } from '@/modules/user/model';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => User, (user) => user.languages, { nullable: false, onDelete: 'CASCADE' })
  users!: User[];
}
