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
                    set({
                        token,
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
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
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            fetchCurrentUser: async () => {
                const { token } = get();
                if (!token) {
                    return;
                }

                set({ isLoading: true });
                try {
                    const user = await getCurrentUser();
                    set({ user, isLoading: false });
                } catch (error) {
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
            onRehydrateStorage: () => () => {
                useAuthStore.getState().setHasHydrated(true);
            },
        }
    )
);

const checkHydration = () => {
    const state = useAuthStore.getState();
    if (!state.hasHydrated) {
        setTimeout(() => {
            useAuthStore.getState().setHasHydrated(true);
        }, 500);
    }
};

setTimeout(checkHydration, 1000);
