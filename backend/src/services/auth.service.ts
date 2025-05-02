import User from "../models/user.model";
import { AppError } from "../middlewares/error.middleware";
import logger from "../utils/logger";

interface UserData {
    name?: string;
    email: string;
    password: string;
}

interface UserResponse {
    id: string;
    name: string;
    email: string;
}

export class AuthService {
    async register(userData: UserData): Promise<{ user: UserResponse; token: string }> {
        const { email } = userData;

        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                throw new AppError("El usuario ya existe", 400);
            }

            const user = await User.create(userData);

            const token = user.generateAuthToken();

            logger.info(`Nuevo usuario registrado: ${user.email}`);

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            };
        } catch (error) {
            if ((error as AppError).isOperational) {
                throw error;
            }

            logger.error(`Error al registrar usuario: ${(error as Error).message}`);
            throw new AppError("Error al registrar usuario", 500);
        }
    }

    async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
        try {
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                throw new AppError("Credenciales inválidas", 401);
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new AppError("Credenciales inválidas", 401);
            }

            const token = user.generateAuthToken();

            logger.info(`Usuario inició sesión: ${user.email}`);

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            };
        } catch (error) {
            if ((error as AppError).isOperational) {
                throw error;
            }

            logger.error(`Error al iniciar sesión: ${(error as Error).message}`);
            throw new AppError("Error al iniciar sesión", 500);
        }
    }

    async getProfile(userId: string): Promise<UserResponse> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new AppError("Usuario no encontrado", 404);
            }

            return {
                id: user._id,
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            if ((error as AppError).isOperational) {
                throw error;
            }

            if ((error as any).name === "CastError") {
                throw new AppError("ID de usuario inválido", 400);
            }

            logger.error(`Error al obtener perfil: ${(error as Error).message}`);
            throw new AppError("Error al obtener perfil de usuario", 500);
        }
    }
}
