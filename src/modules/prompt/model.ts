import { UserPrompt } from '@/modules/user-prompt/model';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('prompts')
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'question_en', type: 'text' })
  questionEn!: string;

  @Column({ name: 'question_fr', type: 'text' })
  questionFr!: string;

  @Column({ name: 'question_es', type: 'text' })
  questionEs!: string;

  @Column({ name: 'question_ar', type: 'text' })
  questionAr!: string;

  @OneToMany(() => UserPrompt, (up) => up.prompt)
  userPrompts!: UserPrompt[];
}
