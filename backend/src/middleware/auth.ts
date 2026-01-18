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
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

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
