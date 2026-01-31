import express, { Application } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import { errorHandler, notFound } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://job-application-tracker-r7mt9fbdm-chut-burs-projects.vercel.app',
            process.env.FRONTEND_URL
        ].filter(Boolean) as string[],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Job Application Tracker API',
        version: '1.0.0',
    });
});

// Health check endpoint for Render
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
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
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
