import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    let decodedToken;
    
    if (process.env.FIREBASE_PROJECT_ID === 'placeholder') {
      // Mock validation for development without real keys
      if (token === 'mock-jwt-token') {
        decodedToken = { uid: 'mock-uid-123', email: 'test@example.com' };
      } else {
        throw new Error('Invalid mock token');
      }
    } else {
      const { getAuth } = require('firebase-admin/auth');
      decodedToken = await getAuth().verifyIdToken(token);
    }

    // Find the user in MongoDB
    let user = await User.findOne({ uid: decodedToken.uid });
    
    // If we're just syncing for the first time, it might not exist yet,
    // so we just pass the decoded token forward to the route controller.
    req.user = {
      firebaseUser: decodedToken,
      dbUser: user
    };
    
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.dbUser || req.user.dbUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};
