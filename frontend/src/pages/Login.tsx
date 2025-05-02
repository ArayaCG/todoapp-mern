import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldsInitialized, setFieldsInitialized] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { login, isAuthenticated, hasHydrated } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Verificar si el usuario ya está autenticado
    useEffect(() => {
        if (isAuthenticated && hasHydrated) {
            navigate("/dashboard");
        }
        if (emailRef.current && emailRef.current.value) {
            setEmail(emailRef.current.value);
        }
    
        if (passwordRef.current && passwordRef.current.value) {
            setPassword(passwordRef.current.value);
        }
    
        setFieldsInitialized(true);
    }, [isAuthenticated, hasHydrated, navigate]);

    const updateEmail = (value: string) => {
        setEmail(value);
    };

    const updatePassword = (value: string) => {
        setPassword(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentEmail = emailRef.current?.value || email;
        const currentPassword = passwordRef.current?.value || password;

        if (!currentEmail || !currentPassword) {
            toast.error("Por favor completa todos los campos");
            return;
        }

        setIsSubmitting(true);

        try {
            await login(currentEmail, currentPassword);
            toast.success("¡Inicio de sesión exitoso!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[hsl(var(--foreground))]">
                        Iniciar sesión
                    </h2>
                    {!fieldsInitialized && (
                        <p className="mt-2 text-center text-sm text-[hsl(var(--muted-foreground))]">
                            Cargando datos...
                        </p>
                    )}
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
                                className="input rounded-b-md pr-10"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => updateEmail(e.target.value)}
                                onInput={(e) => updateEmail(e.currentTarget.value)}
                                ref={emailRef}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className="input rounded-b-md pr-10"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => updatePassword(e.target.value)}
                                onInput={(e) => updatePassword(e.currentTarget.value)}
                                ref={passwordRef}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-2 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-base font-semibold text-[hsl(var(--muted-foreground))]">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register" className="text-blue-600 hover:text-blue-500">
                                Regístrate
                            </Link>
                        </p>
                        <p className="text-base font-semibold text-gray-600 dark:text-gray-400">
                            <Link to="/" className="text-blue-600 hover:text-blue-500">
                                Volver a la página principal
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
