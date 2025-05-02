import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware";
import User from "../models/user.model";
import logger from "../utils/logger";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            logger.warn("Intento de acceso sin token de autenticación");
            next(new AppError("No estás autenticado. Por favor, inicia sesión", 401));
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        const user = await User.findById((decoded as any).id);

        if (!user) {
            logger.warn(`Usuario no encontrado para el token: ${token}`);
            next(new AppError("El usuario perteneciente a este token ya no existe", 401));
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error de autenticación: ${error.message}`);
            next(new AppError("No estás autenticado. Por favor, inicia sesión", 401));
        } else {
            next(new AppError("Error desconocido de autenticación", 401));
        }
    }
};
