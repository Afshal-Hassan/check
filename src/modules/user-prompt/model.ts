import { User } from '@/modules/user/model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_prompts')
export class UserPrompt {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user!: User;

  @Column({ name: 'question' })
  question!: string;

  @Column({ name: 'answer' })
  answer!: string;
}
