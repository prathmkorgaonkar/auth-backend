import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function generateToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET!);
}