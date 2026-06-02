import mongoose from 'mongoose';
import logger from './logger.config';
import { serverConfig } from '.';

export const connectDB=async()=>{
    try{
        const dburi=serverConfig.DB_URL;
        await mongoose.connect(dburi);
        logger.info('Connected to MongoDB successfully');
        mongoose.connection.on("error",(err)=>{
            logger.error('MongoDB connection error:',err);
        });
        mongoose.connection.on("disconnected",()=>{
            logger.warn('MongoDB connection lost. Attempting to reconnect...');
        });
        process.on("SIGINT",async()=>{
            await mongoose.connection.close();
            logger.info('MongoDB connection closed due to app termination');
            process.exit(0);
        });
    }
    catch(error)
    {
        logger.error('Error connecting to MongoDB',error);
        process.exit(1);
    }
}

