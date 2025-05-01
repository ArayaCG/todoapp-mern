import winston from "winston";

// Configuración del logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: "todo-api" },
    transports: [
        // Escribir logs a la consola
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
        }),
        // Escribir logs de error a un archivo
        new winston.transports.File({
            filename: "src/logs/error.log",
            level: "error",
        }),
        // Escribir todos los logs a otro archivo
        new winston.transports.File({
            filename: "src/logs/combined.log",
        }),
    ],
});

// Si no estamos en producción, también loggeamos a la consola con formato colorizado
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
    );
}

export default logger;
