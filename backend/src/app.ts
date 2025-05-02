import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import expressWinston from "express-winston";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

import { apiKeyAuth } from "./middlewares/apiAuth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import logger from "./utils/logger";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Demasiadas solicitudes desde esta IP, inténtalo de nuevo después de 15 minutos",
});

app.use(limiter);

app.use(
    expressWinston.logger({
        winstonInstance: logger,
        meta: false,
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        expressFormat: true,
        colorize: true,
    })
);

app.get("/", (req: Request, res: Response) => {
    res.send("API de Todo App funcionando");
});

app.use("/api", apiKeyAuth);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "error",
        message: `No se encontró la ruta ${req.originalUrl} en este servidor`,
    });
});

app.use(errorHandler);

app.use(
    expressWinston.errorLogger({
        winstonInstance: logger,
    })
);

export default app;
