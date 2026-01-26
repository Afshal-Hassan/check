import { User } from '@/modules/user/model';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Check,
  Index,
} from 'typeorm';

@Entity('matches')
@Check(`"user1_id" <> "user2_id"`)
@Index('unique_match_pair', ['user1', 'user2'], { unique: true })
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1_id' })
  user1!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2_id' })
  user2!: User;

  @CreateDateColumn({ name: 'matched_at' })
  matchedAt!: Date;
}
