import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskModal from "../components/TaskModal";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Task, useTaskStore } from "../store/taskStore";

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    useEffect(() => {
        fetchTasks().catch((error) => {
            toast.error("Error al cargar las tareas");
            console.error(error);
        });
    }, [fetchTasks]);

    const handleEditTask = (task: Task) => {
        console.log("handleEditTask llamado con la tarea:", task); // Agrega esta línea
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentTask(null);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Hola, {user?.name}</span>
                        <button onClick={logout} className="btn btn-secondary">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="px-4 py-6 sm:px-0"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Lista de Tareas</h2>
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        No tienes tareas pendientes. ¡Crea una nueva!
                                    </p>
                                ) : (
                                    <TaskList tasks={tasks} onEdit={handleEditTask} />
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Nueva Tarea</h2>
                                <TaskForm />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {isModalOpen && <TaskModal task={currentTask} isOpen={isModalOpen} onClose={handleCloseModal} />}
        </div>
    );
};

export default Dashboard;
