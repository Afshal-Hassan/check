import { User } from '@/modules/user/model';
import { Prompt } from '@/modules/prompt/model';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

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

  @Column({ name: 'answer_en', type: 'text' })
  answerEn!: string;

  @Column({ name: 'answer_fr', type: 'text' })
  answerFr!: string;

  @Column({ name: 'answer_es', type: 'text' })
  answerEs!: string;

  @Column({ name: 'answer_ar', type: 'text' })
  answerAr!: string;
}
