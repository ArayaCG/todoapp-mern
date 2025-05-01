import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localStorageStatus, setLocalStorageStatus] = useState<string>("Verificando...");

    const { login, isAuthenticated, hasHydrated } = useAuthStore();
    const navigate = useNavigate();

    // Verificar el estado de localStorage
    useEffect(() => {
        // Diagnóstico de localStorage
        try {
            // Prueba escribir y leer de localStorage
            localStorage.setItem("test-storage", "test");
            const testValue = localStorage.getItem("test-storage");

            if (testValue === "test") {
                localStorage.removeItem("test-storage");
                setLocalStorageStatus("LocalStorage disponible ✅");
            } else {
                setLocalStorageStatus("LocalStorage no funciona correctamente ❌");
            }
        } catch (error) {
            setLocalStorageStatus(
                `Error con LocalStorage: ${error instanceof Error ? error.message : String(error)} ❌`
            );
        }

        // Verificar contenido actual de auth-storage
        const authData = localStorage.getItem("auth-storage");
        console.log("Contenido actual de auth-storage:", authData);
    }, []);

    useEffect(() => {
        // Si ya estamos autenticados, redirigir al dashboard
        if (isAuthenticated && hasHydrated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, hasHydrated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Por favor completa todos los campos");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Iniciando login con:", { email });
            await login(email, password);

            // Verificar si el login fue exitoso comprobando localStorage
            const authData = localStorage.getItem("auth-storage");
            console.log("auth-storage después de login:", authData);

            // Verificar el estado actual de Zustand
            const authState = useAuthStore.getState();
            console.log("Estado de Zustand después de login:", {
                isAuthenticated: authState.isAuthenticated,
                tokenExiste: !!authState.token,
                userExiste: !!authState.user,
            });

            toast.success("¡Inicio de sesión exitoso!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error de login:", error);
            toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar sesión</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">{localStorageStatus}</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input rounded-t-md"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="input rounded-b-md"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
