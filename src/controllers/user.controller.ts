import { Request, Response } from 'express';
import { User } from '../models/user.entity';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { AppDataSource } from '../config/data-source';

const userRepo = AppDataSource.getRepository(User);

export default class UserController {
    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
            }

            const user = await userRepo.findOneBy({ email });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                res.status(401).json({ message: 'Invalid credentials' });
            } else {
                const token = generateToken({ id: user.id, email: user.email });
                res.json({ token });
            }

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static signup = async (req: Request, res: Response) => {
        try {
            const { name, email, password, mobile } = req.body;
            console.log("req.body ", req.body);
            
            if (!name || !email || !password || !mobile) {
                res.status(400).json({ message: 'All fields are required' });
            }

            const existing = await userRepo.findOneBy({ email });
            if (existing) {
                res.status(400).json({ message: 'Email already exists' });
            }

            const hashed = await bcrypt.hash(password, 10);
            const user = userRepo.create({ name, email, password: hashed, mobile });
            await userRepo.save(user);

            const token = generateToken({ id: user.id, email: user.email });
            res.status(201).json({ token });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static getProfile = async (req: Request, res: Response) => {
        try {
            const user = req.user;
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const user = req.user as User;
            const { name, mobile, password } = req.body;

            if (!name || !mobile) {
                res.status(400).json({ message: 'Name and mobile are required' });
            }

            user.name = name;
            user.mobile = mobile;

            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }

            await userRepo.save(user);
            res.json({ message: 'Profile updated' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
