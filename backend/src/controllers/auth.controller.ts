import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middlewares/error.middleware";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

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

        const result = await authService.register({ name, email, password });

        res.status(201).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new AppError(errors.array()[0].msg, 400));
            return;
        }

        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener el perfil del usuario
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user._id;

        const userProfile = await authService.getProfile(userId);

        res.status(200).json({
            status: "success",
            data: {
                user: userProfile,
            },
        });
    } catch (error) {
        next(error);
    }
};
