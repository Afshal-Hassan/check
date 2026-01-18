import { save } from './repo';
import { Prompt } from './model';
import { PromptDTO } from './dto';
import { DeepPartial } from 'typeorm';

export const savePrompts = async (data: PromptDTO): Promise<Prompt[]> => {
  const prompts = data.prompts.map((prompt) => ({
    user: { id: data.userId } as DeepPartial<any>,
    question: prompt.question,
    answer: prompt.answer,
  }));

  return save(prompts);
};
