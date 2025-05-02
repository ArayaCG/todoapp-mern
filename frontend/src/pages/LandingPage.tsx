import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { CheckCircle, Clock, List, Shield } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
            <header className="border-b border-gray-200 dark:border-gray-800 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 py-4 flex items-center justify-between">
                    {/* Mobile Header */}
                    <div className="sm:hidden flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <List className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <span className="ml-2 text-lg font-bold">TaskMaster</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle iconSize="h-7 w-7" />
                        </div>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden sm:flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <List className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="ml-2 text-xl font-bold">TaskMaster</span>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <div className="flex-none mx-auto">
                                <ThemeToggle iconSize="h-7 w-7" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="btn btn-secondary">
                                Iniciar sesión
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Organiza tus tareas de forma simple y efectiva
                        </h1>
                        <p className="text-xl md:text-2xl text-[hsl(var(--muted-foreground))] mb-8">
                            TaskMaster te ayuda a gestionar tus tareas diarias para que puedas enfocarte en lo que
                            realmente importa.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                                Comenzar gratis
                            </Link>
                            <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                                Iniciar sesión
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 md:py-20 bg-[hsl(var(--background))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Características principales</h2>
                        <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                            Todo lo que necesitas para mantener tu productividad al máximo
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="card flex flex-col items-center text-center"
                        >
                            <CheckCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Gestión simple</h3>
                            <p className="text-[hsl(var(--muted-foreground))]">
                                Crea, edita y completa tareas con una interfaz intuitiva y fácil de usar.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="card flex flex-col items-center text-center"
                        >
                            <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Ahorra tiempo</h3>
                            <p className="text-[hsl(var(--muted-foreground))]">
                                Organiza tus tareas de manera eficiente para maximizar tu productividad diaria.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="card flex flex-col items-center text-center"
                        >
                            <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Seguro y confiable</h3>
                            <p className="text-[hsl(var(--muted-foreground))]">
                                Tus datos están protegidos y disponibles cuando los necesites.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-blue-600 dark:bg-blue-700 text-white rounded-xl p-8 md:p-12 text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para organizar tus tareas?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Únete a miles de usuarios que ya mejoraron su productividad con TaskMaster.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-white text-blue-600 font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Crear cuenta gratis
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <List className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <span className="ml-2 font-bold">TaskMaster</span>
                        </div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">
                            &copy; {new Date().getFullYear()} TaskMaster. Todos los derechos reservados.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
