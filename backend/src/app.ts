import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import expressWinston from "express-winston";

// Importar rutas
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

// Importar middlewares
import { apiKeyAuth } from "./middlewares/apiAuth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import logger from "./utils/logger";

// Inicializar Express
const app: Application = express();

// Configurar middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configurar el rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: "Demasiadas solicitudes desde esta IP, inténtalo de nuevo después de 15 minutos",
});

// Aplicar el rate limiter a todas las solicitudes
app.use(limiter);

// Configurar logs
app.use(
    expressWinston.logger({
        winstonInstance: logger,
        meta: false,
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        expressFormat: true,
        colorize: true,
    })
);

// Ruta de prueba
app.get("/", (req: Request, res: Response) => {
    res.send("API de Todo App funcionando");
});

// Rutas de la API con autenticación de API key
app.use("/api", apiKeyAuth);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Manejo de errores para rutas no encontradas
app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "error",
        message: `No se encontró la ruta ${req.originalUrl} en este servidor`,
    });
});

// Middleware para manejo de errores
app.use(errorHandler);

// Configuración de logs de errores
app.use(
    expressWinston.errorLogger({
        winstonInstance: logger,
    })
);

export default app;
