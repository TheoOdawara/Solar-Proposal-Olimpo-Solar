import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Try Authorization header first (Bearer <token>)
    let token: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Fallback to cookie named 'token' when frontend uses credentials: 'include'
      const cookieHeader = req.headers.cookie as string | undefined;
      if (cookieHeader) {
        const match = cookieHeader.match(/(?:^|;)\s*token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = verifyToken(token as string);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (req.user.role !== 'administrador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }

  next();
};
