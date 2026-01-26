import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate JWT token
const generateToken = (id: string): string => {
    const secret: any = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.sign({ id }, secret, {
        expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
                return;
            }

            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: 'User already exists with this email',
                });
                return;
            }

            // Create user
            const user = await User.create({
                name,
                email,
                password,
            });

            // Generate token
            const token = generateToken(user._id.toString());

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json({
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error: any) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Error registering user',
            });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
                return;
            }

            const { email, password } = req.body;

            // Find user and include password
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
                return;
            }

            // Check password
            const isPasswordMatch = await user.comparePassword(password);

            if (!isPasswordMatch) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
                return;
            }

            // Generate token
            const token = generateToken(user._id.toString());

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging in',
            });
        }
    }
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (_req, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }

        res.json({
            success: true,
            data: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
            },
        });
    } catch (error: any) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
        });
    }
});

export default router;
