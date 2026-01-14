import axios from 'axios';

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
    throw new Error('Unable to verify from google');
  }
};
