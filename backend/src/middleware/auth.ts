import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('Auth middleware - Cookies:', req.cookies);
        console.log('Auth middleware - Token:', req.cookies.token ? 'Present' : 'Missing');

        const token = req.cookies.token;

        if (!token) {
            console.log('Auth failed: No token in cookies');
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
            return;
        }

        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

            const user = await User.findById(decoded.id);

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
                return;
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error in authentication',
        });
        return;
    }
};
