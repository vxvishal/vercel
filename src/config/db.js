import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB;