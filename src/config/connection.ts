import mongoose from 'mongoose';

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetworkDB');
        console.log('Connected to database.');
        return mongoose.connection;
    }
    catch (error) {
        console.error('Error connecting to database: ', error);
        throw new Error('Database connection failed.');
    }
}

export default db;