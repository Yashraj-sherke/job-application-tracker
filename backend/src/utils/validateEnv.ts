import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

interface ValidationError {
    variable: string;
    message: string;
}

/**
 * Validates all required environment variables for production deployment
 * Throws an error with detailed messages if validation fails
 */
export const validateEnv = (): void => {
    const errors: ValidationError[] = [];
    const isProduction = process.env.NODE_ENV === 'production';

    // Required variables for all environments
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];

    // Check if required variables exist
    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            errors.push({
                variable: varName,
                message: `${varName} is required but not set`,
            });
        }
    });

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET) {
        const jwtSecret = process.env.JWT_SECRET;

        // In production, enforce strong JWT secret
        if (isProduction) {
            if (jwtSecret.length < 32) {
                errors.push({
                    variable: 'JWT_SECRET',
                    message: 'JWT_SECRET must be at least 32 characters in production',
                });
            }

            // Check for common weak secrets
            const weakSecrets = [
                'your_jwt_secret',
                'your-super-secret-jwt-key-change-this-in-production',
                'secret',
                'jwt_secret',
                '12345',
            ];

            if (weakSecrets.some(weak => jwtSecret.toLowerCase().includes(weak.toLowerCase()))) {
                errors.push({
                    variable: 'JWT_SECRET',
                    message: 'JWT_SECRET appears to be a default/weak value. Use a strong random secret in production',
                });
            }
        }
    }

    // Validate MONGODB_URI format
    if (process.env.MONGODB_URI) {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
            errors.push({
                variable: 'MONGODB_URI',
                message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://',
            });
        }

        // Warn if using localhost in production
        if (isProduction && (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1'))) {
            console.warn('⚠️  WARNING: Using localhost MongoDB in production is not recommended');
        }
    }

    // Validate FRONTEND_URL in production
    if (isProduction && !process.env.FRONTEND_URL) {
        console.warn('⚠️  WARNING: FRONTEND_URL is not set. CORS may not work correctly');
    }

    // If there are errors, throw with detailed message
    if (errors.length > 0) {
        const errorMessage = [
            '❌ Environment Variable Validation Failed:',
            '',
            ...errors.map(err => `  • ${err.variable}: ${err.message}`),
            '',
            'Please check your .env file and ensure all required variables are set correctly.',
            'See .env.example for reference.',
        ].join('\n');

        throw new Error(errorMessage);
    }

    // Success message (only in non-production)
    if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Environment variables validated successfully');
    }
};

export default validateEnv;
