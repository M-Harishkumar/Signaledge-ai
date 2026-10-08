import { Request, Response, NextFunction } from 'express';
import { db, StoredUser } from '../db/database';

export interface AuthenticatedRequest extends Request {
  user?: StoredUser;
  token?: string;
}

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (token) {
    const session = db.getSession(token);
    if (session) {
      const user = db.getUserById(session.user_id);
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
  }

  // Fallback to default demo user if not logged in for read-only browsing
  if (!req.user) {
    const defaultUser = db.getUserByEmail('investor@signaledge.in');
    if (defaultUser) {
      req.user = defaultUser;
    }
  }

  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to perform this action.',
      },
    });
  }
  next();
}
