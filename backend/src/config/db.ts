import mongoose from "mongoose";
import logger from "../utils/logger";

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/todo_app");
        logger.info(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error al conectar a MongoDB: ${error.message}`);
        } else {
            logger.error("Error desconocido al conectar a MongoDB");
        }
        process.exit(1);
    }
};
