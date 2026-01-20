import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Index, JoinColumn } from 'typeorm';
import { User } from '@/modules/user/model';
import { Prompt } from '@/modules/prompt/model';

@Entity('user_prompts')
export class UserPrompt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Prompt, (prompt) => prompt.userPrompts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'prompt_id' })
  prompt!: Prompt;

  @Column()
  answer!: string;
}
