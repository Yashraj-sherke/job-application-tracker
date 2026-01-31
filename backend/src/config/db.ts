import mongoose from 'mongoose';

const connectDB = async (retries = 5): Promise<void> => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-tracker';
    let currentRetry = 0;

    while (currentRetry < retries) {
        try {
            await mongoose.connect(mongoURI);

            if (process.env.NODE_ENV !== 'production') {
                console.log('✅ MongoDB connected successfully');
            }

            mongoose.connection.on('error', (err) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('❌ MongoDB connection error:', err);
                }
            });

            mongoose.connection.on('disconnected', () => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('⚠️  MongoDB disconnected');
                }
            });

            // Successfully connected, exit the retry loop
            return;

        } catch (error) {
            currentRetry++;
            if (process.env.NODE_ENV !== 'production') {
                console.error(`❌ MongoDB connection attempt ${currentRetry}/${retries} failed:`, error);
            }

            if (currentRetry >= retries) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('❌ All MongoDB connection attempts exhausted. Exiting...');
                }
                process.exit(1);
            }

            // Exponential backoff: wait 2^retry seconds (2s, 4s, 8s, 16s, 32s)
            const waitTime = Math.min(Math.pow(2, currentRetry) * 1000, 32000);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`⏳ Retrying in ${waitTime / 1000} seconds...`);
            }
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

export default connectDB;
