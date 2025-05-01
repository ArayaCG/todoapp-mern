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
    /**
     * Registra un nuevo usuario
     */
    async register(userData: UserData): Promise<{ user: UserResponse; token: string }> {
        const { email } = userData;

        try {
            // Verificar si el usuario ya existe
            const userExists = await User.findOne({ email });
            if (userExists) {
                throw new AppError("El usuario ya existe", 400);
            }

            // Crear nuevo usuario
            const user = await User.create(userData);

            // Generar token de autenticación
            const token = user.generateAuthToken();

            logger.info(`Nuevo usuario registrado: ${user.email}`);

            // Retornar datos del usuario y token
            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            };
        } catch (error) {
            // Si es un error operacional, lo reenviamos tal cual
            if ((error as AppError).isOperational) {
                throw error;
            }

            // Si es otro tipo de error (por ejemplo, de Mongoose), lo registramos y lanzamos uno genérico
            logger.error(`Error al registrar usuario: ${(error as Error).message}`);
            throw new AppError("Error al registrar usuario", 500);
        }
    }

    /**
     * Inicia sesión de un usuario
     */
    async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
        try {
            // Buscar usuario por email
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                throw new AppError("Credenciales inválidas", 401);
            }

            // Verificar contraseña
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new AppError("Credenciales inválidas", 401);
            }

            // Generar token
            const token = user.generateAuthToken();

            logger.info(`Usuario inició sesión: ${user.email}`);

            // Retornar datos del usuario y token
            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            };
        } catch (error) {
            // Si es un error operacional, lo reenviamos tal cual
            if ((error as AppError).isOperational) {
                throw error;
            }

            // Si es otro tipo de error, lo registramos y lanzamos uno genérico
            logger.error(`Error al iniciar sesión: ${(error as Error).message}`);
            throw new AppError("Error al iniciar sesión", 500);
        }
    }

    /**
     * Obtiene el perfil del usuario actual
     */
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
            // Si es un error operacional, lo reenviamos tal cual
            if ((error as AppError).isOperational) {
                throw error;
            }

            // Si es un error de Cast (ID inválido), lanzamos un error más específico
            if ((error as any).name === "CastError") {
                throw new AppError("ID de usuario inválido", 400);
            }

            // Si es otro tipo de error, lo registramos y lanzamos uno genérico
            logger.error(`Error al obtener perfil: ${(error as Error).message}`);
            throw new AppError("Error al obtener perfil de usuario", 500);
        }
    }
}
