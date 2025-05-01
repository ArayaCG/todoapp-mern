import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { AppError } from "../middlewares/error.middleware";
import logger from "../utils/logger";

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new AppError(errors.array()[0].msg, 400));
            return;
        }

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            next(new AppError("El usuario ya existe", 400));
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });

        logger.info(`Nuevo usuario registrado: ${user.email}`);
    } catch (error) {
        next(error);
    }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validar los datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new AppError(errors.array()[0].msg, 400));
            return;
        }

        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            next(new AppError("Credenciales inválidas", 401));
            return;
        }

        // Verificar la contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            next(new AppError("Credenciales inválidas", 401));
            return;
        }

        // Generar token
        const token = user.generateAuthToken();

        // Responder con los datos del usuario y el token
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });

        logger.info(`Usuario inició sesión: ${user.email}`);
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener el perfil del usuario
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // El usuario ya está en req.user gracias al middleware protect
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
