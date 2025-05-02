import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
    let error = { ...err };
    error.message = err.message;

    logger.error(`${req.method} ${req.path} - ${err.message}`);

    if ((err as any).name === "CastError") {
        const message = "Recurso no encontrado";
        error = new AppError(message, 404);
    }

    if ((err as any).code === 11000) {
        const message = "Valor duplicado ingresado";
        error = new AppError(message, 400);
    }

    if ((err as any).name === "ValidationError") {
        const message = Object.values((err as any).errors)
            .map((val: any) => val.message)
            .join(", ");
        error = new AppError(message, 400);
    }

    res.status((error as AppError).statusCode || 500).json({
        status: (error as AppError).status || "error",
        message: (error as AppError).message || "Error interno del servidor",
    });
};
