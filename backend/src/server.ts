import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import validateEnv from './utils/validateEnv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import { errorHandler, notFound } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Validate environment variables before starting
validateEnv();

// Initialize express app
const app: Application = express();

// Connect to database
connectDB();

// Security Middleware
app.use(helmet()); // Adds security headers

// CORS Middleware
// Allow multiple origins for Vercel deployments
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Check if origin is in allowed list
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow all Vercel preview deployments
            if (origin.includes('vercel.app')) {
                return callback(null, true);
            }

            // Reject other origins
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoints
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Routes
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Job Application Tracker API',
        version: '1.0.0',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    }
});

export default app;
