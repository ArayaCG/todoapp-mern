import type React from "react";
import { useState } from "react";
import { useTaskStore, type Task } from "../store/taskStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import DeleteTaskModal from "./DeleteTaskModal";
import { CheckCircle, XCircle, Edit, Trash } from "lucide-react";

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit }) => {
    const { updateTaskStatus } = useTaskStore();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const handleStatusChange = async (task: Task) => {
        try {
            await updateTaskStatus(task.id, !task.completed);
            toast.success(`Tarea ${task.completed ? "marcada como pendiente" : "completada"}`);
        } catch (error) {
            toast.error("Error al actualizar el estado de la tarea");
            console.error(error);
        }
    };

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setTaskToDelete(null);
        setDeleteModalOpen(false);
    };

    // Función para formatear la fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div className="space-y-4">
            <AnimatePresence initial={false}>
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        layout
                        className={`border rounded-lg p-4 ${
                            task.completed
                                ? "bg-[hsl(var(--muted))] border-gray-200"
                                : "bg-[hsl(var(--background))] border-gray-300"
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3
                                    className={`text-lg font-medium ${
                                        task.completed
                                            ? "text-[hsl(var(--muted-foreground))] line-through"
                                            : "text-[hsl(var(--foreground))]"
                                    }`}
                                >
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p
                                        className={`mt-1 text-sm ${
                                            task.completed
                                                ? "text-[hsl(var(--muted-foreground))]"
                                                : "text-[hsl(var(--muted-foreground))]"
                                        }`}
                                    >
                                        {task.description}
                                    </p>
                                )}
                                <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))] flex items-center">
                                    <span
                                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                            task.completed ? "bg-green-500" : "bg-yellow-500"
                                        }`}
                                    ></span>
                                    {task.completed ? "Completada" : "Pendiente"} • Creada: {formatDate(task.createdAt)}
                                </div>
                            </div>

                            <div className="flex space-x-2 ml-4">
                                <button
                                    onClick={() => handleStatusChange(task)}
                                    className={`p-1.5 rounded-full ${
                                        task.completed
                                            ? "text-[hsl(var(--muted-foreground))] hover:bg-gray-100"
                                            : "text-green-600 hover:bg-green-100"
                                    }`}
                                    title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                                >
                                    {task.completed ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                </button>

                                <button
                                    onClick={() => onEdit(task)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    title="Editar tarea"
                                >
                                    <Edit size={20} />
                                </button>

                                <button
                                    onClick={() => handleDeleteClick(task)}
                                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-red-900/20"
                                    title="Eliminar tarea"
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {deleteModalOpen && taskToDelete && (
                <DeleteTaskModal task={taskToDelete} isOpen={deleteModalOpen} onClose={handleCloseDeleteModal} />
            )}
        </div>
    );
};

export default TaskList;
