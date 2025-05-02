import { body } from "express-validator";

export const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ max: 50 })
        .withMessage("El nombre no puede tener más de 50 caracteres"),
    body("email").notEmpty().withMessage("El email es requerido").isEmail().withMessage("El email debe ser válido"),
    body("password")
        .notEmpty()
        .withMessage("La contraseña es requerida")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const loginValidator = [
    body("email").notEmpty().withMessage("El email es requerido").isEmail().withMessage("El email debe ser válido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
];

export const taskValidator = [
    body("title")
        .notEmpty()
        .withMessage("El título es requerido")
        .isLength({ max: 100 })
        .withMessage("El título no puede tener más de 100 caracteres"),
    body("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("La descripción no puede tener más de 500 caracteres"),
    body("completed").optional().isBoolean().withMessage("El campo completado debe ser un booleano"),
    body("priority").optional().isIn(["baja", "media", "alta"]).withMessage("La prioridad debe ser baja, media o alta"),
    body("dueDate").optional().isISO8601().withMessage("La fecha de vencimiento debe ser una fecha válida"),
];
