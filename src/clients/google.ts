import axios from 'axios';
import { BadRequestException } from '@/exceptions/bad-request.exception';
import { ENV } from '@/config/env.config';

export const verifyToken = async (accessToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: ENV.OAUTH.GOOGLE_API_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error) {
    throw new BadRequestException('Unable to verify from google');
  }
};
