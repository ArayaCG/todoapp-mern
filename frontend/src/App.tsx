import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
    const { isAuthenticated, token, hasHydrated, fetchCurrentUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Aumentamos el tiempo de espera para la rehidratación para casos extremos
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // 3 segundos de espera

        // Si ya se ha hidratado, procedemos con la lógica normal
        if (hasHydrated) {
            clearTimeout(timeout);

            // Solo intentar actualizar el usuario si ya estamos autenticados
            if (isAuthenticated && token) {
                fetchCurrentUser()
                    .catch((err) => console.error("Error al obtener usuario actual:", err))
                    .finally(() => {
                        setIsLoading(false);
                    });
            } else {
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
        <ThemeProvider defaultTheme="light" storageKey="taskmaster-theme">
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
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
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
