import axios from 'axios';
import { BadRequestException } from '@/exceptions/bad-request.exception';

export const verifyToken = async (accessToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: process.env.GOOGLE_OAUTH_API_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error) {
    throw new BadRequestException('Unable to verify from google');
  }
};
