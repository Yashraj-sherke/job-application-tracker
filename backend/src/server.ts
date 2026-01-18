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
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
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
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
