import mongoose from "mongoose";
import _ from "colors";

export const connectD = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connect databse success: ${conn.connection.host}`.green);
    } catch (error) {
        console.log(`Error connect database ${error}`.red);
    }
};
