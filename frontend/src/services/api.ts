import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const waitForHydration = (): Promise<void> => {
            return new Promise((resolve) => {
                const auth = useAuthStore.getState();
                if (auth.hasHydrated) {
                    return resolve();
                }

                const timeout = setTimeout(() => {
                    console.warn("Zustand hydration timeout");
                    resolve();
                }, 1000);

                const unsubscribe = useAuthStore.subscribe((state) => {
                    if (state.hasHydrated) {
                        clearTimeout(timeout);
                        unsubscribe();
                        resolve();
                    }
                });
            });
        };

        await waitForHydration();

        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers["x-api-client-id"] = import.meta.env.VITE_API_CLIENT_ID;
        config.headers["x-api-client-secret"] = import.meta.env.VITE_API_CLIENT_SECRET;

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
