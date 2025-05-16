import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.entity';
import { AppDataSource } from '../config/data-source';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {

    const token = authHeader.split(' ')[1];
  
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: decoded.userId });
  
      if (!user) res.status(401).json({ message: 'User not found' });
  
      req.user = user;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  }

};
