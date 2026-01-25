import { ENV } from '@/config/env.config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export const AUTH_MIDDLEWARE_ERROR_MESSAGES = {
  TOKEN_MISSING: {
    en: 'Authorization token missing',
    fr: "Jeton d'autorisation manquant",
    es: 'Falta el token de autorización',
    ar: 'رمز التفويض مفقود',
  },
  JWT_SECRET_NOT_CONFIGURED: {
    en: 'JWT_SECRET not configured',
    fr: 'JWT_SECRET non configuré',
    es: 'JWT_SECRET no configurado',
    ar: 'لم يتم تكوين JWT_SECRET',
  },
  INVALID_OR_EXPIRED_TOKEN: {
    en: 'Invalid or expired token',
    fr: 'Jeton invalide ou expiré',
    es: 'Token inválido o expirado',
    ar: 'رمز غير صالح أو منتهي الصلاحية',
  },
  UNAUTHORIZED: {
    en: 'Unauthorized',
    fr: 'Non autorisé',
    es: 'No autorizado',
    ar: 'غير مصرح',
  },
  ADMIN_ACCESS_REQUIRED: {
    en: 'Admin access required',
    fr: 'Accès administrateur requis',
    es: 'Se requiere acceso de administrador',
    ar: 'يتطلب وصول المسؤول',
  },
  USER_ACCESS_REQUIRED: {
    en: 'User access required',
    fr: 'Accès utilisateur requis',
    es: 'Se requiere acceso de usuario',
    ar: 'يتطلب وصول المستخدم',
  },
};

const ADMIN_ROUTES = [/(?:\/api)?\/user\/all/];
const PUBLIC_ROUTES = [
  /(?:\/api)?\/auth\/login/,
  /(?:\/api)?\/auth\/signup/,
  /(?:\/api)?\/auth\/complete-signup/,
  /(?:\/api)?\/auth\/forgot-password/,
  /(?:\/api)?\/auth\/reset-password/,
  /(?:\/api)?\/otp\/verify/,
  /(?:\/api)?\/otp\/resend/,
];

const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some((pattern) => pattern.test(path));
};

const isAdminRoute = (path: string): boolean => {
  return ADMIN_ROUTES.some((pattern) => pattern.test(path));
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (isPublicRoute(req.originalUrl)) {
    return next();
  }

  const languageCode = HeaderUtil.getLanguageCode(req);
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_MIDDLEWARE_ERROR_MESSAGES.TOKEN_MISSING,
        languageCode,
      ),
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = ENV.JWT.SECRET;

  if (!secret) {
    return res.status(500).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_MIDDLEWARE_ERROR_MESSAGES.JWT_SECRET_NOT_CONFIGURED,
        languageCode,
      ),
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_MIDDLEWARE_ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
        languageCode,
      ),
    });
  }
};

export const authorize = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (isPublicRoute(req.originalUrl)) {
    return next();
  }

  const languageCode = HeaderUtil.getLanguageCode(req);

  if (!req.user) {
    return res.status(401).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_MIDDLEWARE_ERROR_MESSAGES.UNAUTHORIZED,
        languageCode,
      ),
    });
  }

  const { role } = req.user;

  if (isAdminRoute(req.path)) {
    if (role !== 'admin') {
      return res.status(403).json({
        message: MessageUtil.getLocalizedMessage(
          AUTH_MIDDLEWARE_ERROR_MESSAGES.ADMIN_ACCESS_REQUIRED,
          languageCode,
        ),
      });
    }
    return next();
  }

  if (role !== 'user') {
    return res.status(403).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_MIDDLEWARE_ERROR_MESSAGES.USER_ACCESS_REQUIRED,
        languageCode,
      ),
    });
  }

  next();
};
