import { InterestDTO } from './dto';
import { save } from './repo';

export const saveInterests = async (data: InterestDTO): Promise<void> => {
  const { userId, interests } = data;

  return save(userId, interests);
};
