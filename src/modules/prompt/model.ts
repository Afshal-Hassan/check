import { User } from '@/modules/user/model';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prompts')
@Index('idx_prompts_user_id', ['user'])
export class Prompt {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'question' })
  question!: string;

  @Column({ name: 'answer' })
  answer!: string;
}
