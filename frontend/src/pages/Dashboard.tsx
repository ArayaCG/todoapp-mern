import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskModal from "../components/TaskModal";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { type Task, useTaskStore } from "../store/taskStore";
import { ThemeToggle } from "../components/ThemeToggle";
import { ArrowDownAZ, ArrowUpAZ, Filter } from "lucide-react";

type FilterType = "all" | "pending" | "completed";
type SortDirection = "asc" | "desc";

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    useEffect(() => {
        if (tasks.length === 0) {
            fetchTasks().catch((error) => {
                toast.error("Error al cargar las tareas");
                console.error(error);
            });
        }
    }, [fetchTasks, tasks.length]);

    const handleEditTask = (task: Task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentTask(null);
        setIsModalOpen(false);
    };

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    };

    const filteredTasks = tasks.filter((task) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "pending") return !task.completed;
        if (activeFilter === "completed") return task.completed;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
            <header className="bg-[hsl(var(--background))] shadow">
                <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-32 flex items-center justify-between">
                    <div className="text-left">
                        <h1 className="text-xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">Mis Tareas</h1>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <div className="flex-none mx-auto">
                            <ThemeToggle />
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:block text-[hsl(var(--foreground))] font-bold text-lg">
                            <span>Hola, {user?.name}</span>
                        </div>
                        <div>
                            <button onClick={logout} className="btn btn-secondary w-auto min-w-[100px]">
                                Cerrar sesión
                            </button>
                        </div>
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
                            <div className="bg-[hsl(var(--background))] shadow rounded-lg p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                    <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4 sm:mb-0">
                                        Lista de Tareas
                                    </h2>

                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                                        <div className="flex rounded-md shadow-sm">
                                            <button
                                                onClick={() => setActiveFilter("all")}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                                                    activeFilter === "all"
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-gray-300 hover:bg-[hsl(var(--muted))] dark:border-gray-600 dark:hover:bg-[hsl(var(--muted))]"
                                                }`}
                                            >
                                                Todas
                                            </button>
                                            <button
                                                onClick={() => setActiveFilter("pending")}
                                                className={`px-3 py-1.5 text-sm font-medium border-t border-b ${
                                                    activeFilter === "pending"
                                                        ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700"
                                                        : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-gray-300 hover:bg-[hsl(var(--muted))] dark:border-gray-600 dark:hover:bg-[hsl(var(--muted))]"
                                                }`}
                                            >
                                                Pendientes
                                            </button>
                                            <button
                                                onClick={() => setActiveFilter("completed")}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-r-md border ${
                                                    activeFilter === "completed"
                                                        ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700"
                                                        : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-gray-300 hover:bg-[hsl(var(--muted))] dark:border-gray-600 dark:hover:bg-[hsl(var(--muted))]"
                                                }`}
                                            >
                                                Completadas
                                            </button>
                                        </div>

                                        <button
                                            onClick={toggleSortDirection}
                                            className="flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] dark:border-gray-600 dark:hover:bg-[hsl(var(--muted))]"
                                            title={
                                                sortDirection === "desc"
                                                    ? "Más recientes primero"
                                                    : "Más antiguas primero"
                                            }
                                        >
                                            {sortDirection === "desc" ? (
                                                <>
                                                    <ArrowDownAZ className="h-4 w-4 mr-1" /> Más recientes
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowUpAZ className="h-4 w-4 mr-1" /> Más antiguas
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : sortedTasks.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Filter className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))] mb-2" />
                                        <p className="text-[hsl(var(--muted-foreground))]">
                                            {activeFilter === "all"
                                                ? "No tienes tareas pendientes. ¡Crea una nueva!"
                                                : activeFilter === "pending"
                                                ? "No tienes tareas pendientes."
                                                : "No tienes tareas completadas."}
                                        </p>
                                    </div>
                                ) : (
                                    <TaskList tasks={sortedTasks} onEdit={handleEditTask} />
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="bg-[hsl(var(--background))] shadow rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-[hsl(var(--foreground))]">
                                    Nueva Tarea
                                </h2>
                                <TaskForm />
                            </div>

                            <div className="bg-[hsl(var(--background))] shadow rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-semibold mb-4 text-[hsl(var(--foreground))]">
                                    Estadísticas
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-[hsl(var(--stats-pending-bg))]">
                                        <p className="text-sm text-[hsl(var(--stats-pending-text))]">Pendientes</p>
                                        <p className="text-2xl font-bold text-[hsl(var(--stats-pending-text))]">
                                            {tasks.filter((t) => !t.completed).length}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[hsl(var(--stats-completed-bg))]">
                                        <p className="text-sm text-[hsl(var(--stats-completed-text))]">Completadas</p>
                                        <p className="text-2xl font-bold text-[hsl(var(--stats-completed-text))]">
                                            {tasks.filter((t) => t.completed).length}
                                        </p>
                                    </div>
                                </div>
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
