import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";

function App() {
    const { isAuthenticated, token, hasHydrated, fetchCurrentUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("App cargando - Estado actual:", { hasHydrated, isAuthenticated, tokenExiste: !!token });

        // Aumentamos el tiempo de espera para la rehidratación para casos extremos
        const timeout = setTimeout(() => {
            console.log("Tiempo de espera de rehidratación agotado - continuando de todos modos");
            setIsLoading(false);
        }, 3000); // 3 segundos de espera

        // Si ya se ha hidratado, procedemos con la lógica normal
        if (hasHydrated) {
            clearTimeout(timeout);
            console.log("Estado rehidratado, verificando autenticación");

            // Solo intentar actualizar el usuario si ya estamos autenticados
            if (isAuthenticated && token) {
                console.log("Usuario autenticado, obteniendo datos actuales");
                fetchCurrentUser()
                    .catch((err) => console.error("Error al obtener usuario actual:", err))
                    .finally(() => {
                        console.log("Finalizada verificación de usuario");
                        setIsLoading(false);
                    });
            } else {
                console.log("Usuario no autenticado");
                setIsLoading(false);
            }
        }

        return () => clearTimeout(timeout);
    }, [hasHydrated, isAuthenticated, token, fetchCurrentUser]);

    // Mostrar un loader mientras se verifica la autenticación
    if (isLoading) {
        return <Loading />;
    }

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
