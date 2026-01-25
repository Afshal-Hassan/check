import { ENV } from '@/config/env.config';
import { UnauthorizedException } from '@/exceptions';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
}

interface TokenPayload {
  email: string;
  userId: string;
}

export const generateToken = (user: User, role: string): string => {
  const secret = ENV.JWT.SECRET;
  const expiresIn: any = ENV.JWT.EXPIRES_IN;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign({ userId: user.id, email: user.email, role }, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = ENV.JWT.SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded as TokenPayload;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
};
