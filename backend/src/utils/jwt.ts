import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret: jwt.Secret = config.jwt.secret as jwt.Secret;
  const options = { expiresIn: config.jwt.expiresIn } as unknown as jwt.SignOptions;

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const secret: jwt.Secret = config.jwt.secret as jwt.Secret;
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};
