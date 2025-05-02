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
        const verifyAuth = async () => {
            if (!hasHydrated) {
                return;
            }

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                await fetchCurrentUser();
                setIsValidSession(true);
            } catch (error) {
                console.error("Error al verificar la autenticación:", error);
                setIsValidSession(false);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        verifyAuth();

        return () => clearTimeout(timeoutId);
    }, [hasHydrated, token, fetchCurrentUser]);

    if (isLoading) {
        return <Loading />;
    }

    if (!isAuthenticated || !isValidSession) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
