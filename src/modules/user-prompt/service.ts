import { save } from './repo';
import { DeepPartial } from 'typeorm';
import { UserPromptDTO } from './dto';
import { UserPrompt } from './model';

export const saveUserPrompt = async (data: UserPromptDTO): Promise<UserPrompt> => {
  return save({
    user: { id: data.userId } as DeepPartial<any>,
    question: data.question,
    answer: data.answer,
  });
};
