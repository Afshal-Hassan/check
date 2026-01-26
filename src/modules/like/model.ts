import { User } from '@/modules/user/model';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
  Check,
  Column,
} from 'typeorm';
import { ReactionType } from './enums';

@Entity('likes')
@Unique(['liker', 'liked'])
@Check(`"liker_user_id" <> "liked_user_id"`)
export class Like {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'reaction_giver_id' })
  reactionGiver!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'reaction_receiver_id' })
  reactionReceiver!: User;

  @Column({ name: 'reaction_type', type: 'varchar', length: 32, nullable: false })
  reactionType!: ReactionType;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt!: Date;
}
