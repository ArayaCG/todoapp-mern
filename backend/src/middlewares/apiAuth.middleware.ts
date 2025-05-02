import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.headers["x-api-client-id"];
    const clientSecret = req.headers["x-api-client-secret"];

    if (!clientId || !clientSecret) {
        logger.warn("Intento de acceso sin API keys");
        res.status(401).json({
            status: "error",
            message: "API client ID y secret son requeridos",
        });
        return;
    }

    if (clientId !== process.env.API_CLIENT_ID || clientSecret !== process.env.API_CLIENT_SECRET) {
        logger.warn(`Intento de acceso con API keys inválidas: ${clientId}`);
        res.status(401).json({
            status: "error",
            message: "API client ID o secret inválidos",
        });
        return;
    }

    next();
};
