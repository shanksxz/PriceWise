import mongoose from "mongoose";


let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery',true)

    if(!process.env.MONGODB_URI) return console.log('MONGODB_URI is missing');
    if(isConnected) return console.log('=> using existing connection');

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        isConnected = true;
        console.log('MongoDB connection established')
    } catch (error) {
        console.log(error);
    }

    if(!isConnected) return console.log('Couldnt connect to MongoDB')
} 