import { IsNotEmpty, IsUUID } from 'class-validator';

export class SaveLikeDto {
  @IsUUID('4', { message: 'likedId must be a valid UUID' })
  @IsNotEmpty({ message: 'likedId field is required' })
  reactionReceiverId!: string;
}
