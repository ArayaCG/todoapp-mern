import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "./Loading";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, token, hasHydrated, fetchCurrentUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isValidSession, setIsValidSession] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Función para verificar la autenticación
        const verifyAuth = async () => {
            // Esperamos a que el store se hidrate desde localStorage
            if (!hasHydrated) {
                return;
            }

            // Si no hay token, no necesitamos hacer la petición
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                // Verificamos que el token sea válido obteniendo el usuario actual
                await fetchCurrentUser();
                setIsValidSession(true);
            } catch (error) {
                console.error("Error al verificar la autenticación:", error);
                // Si hay error, el token no es válido
                setIsValidSession(false);
            } finally {
                setIsLoading(false);
            }
        };

        // Establecemos un timeout por si la hidratación tarda demasiado
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        verifyAuth();

        return () => clearTimeout(timeoutId);
    }, [hasHydrated, token, fetchCurrentUser]);

    // Si aún se está cargando, mostrar el componente de carga
    if (isLoading) {
        return <Loading />;
    }

    // Si no está autenticado o la sesión no es válida, redirigir al login
    if (!isAuthenticated || !isValidSession) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si está autenticado y la sesión es válida, mostrar los hijos (Dashboard)
    return <>{children}</>;
};

export default ProtectedRoute;
