import { UserPrompt } from '@/modules/user-prompt/model';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('prompts')
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  question!: string;

  @OneToMany(() => UserPrompt, (up) => up.prompt)
  userPrompts!: UserPrompt[];
}
