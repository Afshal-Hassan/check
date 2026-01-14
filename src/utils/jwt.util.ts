import jwt, { JwtPayload } from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
}

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '30d' });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
