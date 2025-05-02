import axios from "axios";
import api from "./api";

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post("/auth/login", { email, password });

        let userData;
        let tokenData;

        if (response.data.data) {
            userData = response.data.data.user;
            tokenData = response.data.data.token;
        } else if (response.data.user && response.data.token) {
            userData = response.data.user;
            tokenData = response.data.token;
        } else {
            throw new Error("Formato de respuesta inválido");
        }

        if (!tokenData || !userData) {
            throw new Error("Datos de autenticación incompletos");
        }

        return {
            token: tokenData,
            user: userData,
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al iniciar sesión");
        }
        throw new Error("Error al conectar con el servidor");
    }
};

export const registerUser = async (name: string, email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post("/auth/register", { name, email, password });
        const { data } = response.data;

        if (!data || !data.token || !data.user) {
            throw new Error("Formato de respuesta inválido");
        }

        return {
            token: data.token,
            user: data.user,
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al registrarse");
        }
        throw new Error("Error al conectar con el servidor");
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/auth/me");
        return response.data.data.user;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al obtener usuario");
        }
        throw new Error("Error al conectar con el servidor");
    }
};
