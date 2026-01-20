import { User } from '@/modules/user/model';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';

@Entity('likes')
@Unique(['liker', 'liked'])
@Check(`"liker_user_id" <> "liked_user_id"`)
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'liker_user_id' })
  liker!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'liked_user_id' })
  liked!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
