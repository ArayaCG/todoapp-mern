import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loading from "./Loading";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, token, hasHydrated } = useAuthStore();
    const location = useLocation();

    useEffect(() => {}, [isAuthenticated, token, hasHydrated]);

    // Si el estado de persistencia aún no se ha cargado, mostrar cargando
    if (!hasHydrated) {
        return <Loading />;
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si está autenticado, mostrar el contenido protegido
    return <>{children}</>;
};

export default ProtectedRoute;
