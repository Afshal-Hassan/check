import { InterestDTO } from './dto';
import { save } from './repo';

export const saveInterests = async (data: InterestDTO) => {
  const { userId, interests } = data;

  return save(userId, interests);
};
