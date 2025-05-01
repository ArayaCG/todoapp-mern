import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUser, registerUser, getCurrentUser } from "../services/authService";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    hasHydrated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchCurrentUser: () => Promise<void>;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            hasHydrated: false,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { token, user } = await loginUser(email, password);
                    console.log("Login exitoso, guardando datos:", { token, user });
                    set({
                        token,
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    // Verificar inmediatamente si los datos se han establecido correctamente
                    const state = get();
                    console.log("Estado después de login:", {
                        token: state.token,
                        user: state.user,
                        isAuthenticated: state.isAuthenticated,
                    });
                } catch (error) {
                    console.error("Error durante login:", error);
                    set({
                        error: error instanceof Error ? error.message : "Error al iniciar sesión",
                        isLoading: false,
                    });
                    throw error;
                }
            },

            register: async (name, email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { token, user } = await registerUser(name, email, password);
                    set({
                        token,
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : "Error al registrarse",
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                console.log("Cerrando sesión...");
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            fetchCurrentUser: async () => {
                const { token } = get();
                if (!token) {
                    console.log("No hay token, no se puede obtener usuario actual");
                    return;
                }

                set({ isLoading: true });
                try {
                    const user = await getCurrentUser();
                    set({ user, isLoading: false });
                } catch (error) {
                    console.error("Error al obtener usuario actual:", error);
                    set({
                        error: error instanceof Error ? error.message : "Error al obtener usuario",
                        isLoading: false,
                    });
                }
            },

            setHasHydrated: (state) => {
                set({ hasHydrated: state });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            // Corrección importante aquí - corregimos el onRehydrateStorage
            onRehydrateStorage: () => (state) => {
                console.log("🔁 Estado rehidratado:", {
                    token: state?.token ? "Token presente" : "No hay token",
                    user: state?.user ? "Usuario presente" : "No hay usuario",
                    isAuthenticated: state?.isAuthenticated,
                });

                // Corrección clave: Llamar a setHasHydrated correctamente
                useAuthStore.getState().setHasHydrated(true);
            },
        }
    )
);

// Verificar el estado de hidratación manualmente como respaldo
// Esta es una medida adicional para asegurar que hasHydrated se establezca
const checkHydration = () => {
    const state = useAuthStore.getState();
    if (!state.hasHydrated) {
        console.log("Activando hidratación manualmente después de 500ms");
        setTimeout(() => {
            useAuthStore.getState().setHasHydrated(true);
        }, 500);
    }
};

// Llamar a checkHydration después de un breve retraso para permitir la rehidratación normal
setTimeout(checkHydration, 1000);
