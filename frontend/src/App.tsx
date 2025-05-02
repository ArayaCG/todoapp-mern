import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import React, { Suspense } from "react";
import Loading from "./components/Loading";
import LandingPage from "./pages/LandingPage";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));

function App() {
    const { isAuthenticated } = useAuthStore();

    return (
        <ThemeProvider defaultTheme="light" storageKey="taskmaster-theme">
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route
                        path="/"
                        element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/login"
                        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/register"
                        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <Suspense fallback={<Loading />}>
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
