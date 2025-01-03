const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

const { Schema } = mongoose

module.exports = { connectDB, Schema, mongoose };
