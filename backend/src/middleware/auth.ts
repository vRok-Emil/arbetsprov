import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string | number;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token krävs' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (error, decoded: any) => {
      if (error) {
        return res.status(403).json({ message: 'Ogiltig eller utgången token' });
      }
      
      // Add userId to request object
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}