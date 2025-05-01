import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import logger from "./utils/logger";

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Iniciar el servidor
const server = app.listen(PORT, () => {
    logger.info(`Servidor iniciado en el puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});

// Manejar errores no controlados
process.on("unhandledRejection", (err: Error) => {
    logger.error(`Error no controlado: ${err.message}`);
    server.close(() => process.exit(1));
});
