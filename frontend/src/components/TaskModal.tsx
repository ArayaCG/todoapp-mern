import type React from "react";
import { useState, useEffect } from "react";
import { useTaskStore, type Task } from "../store/taskStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TaskModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { editTask } = useTaskStore();

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!task) {
            console.error("No hay tarea para editar");
            return;
        }

        if (!title.trim()) {
            toast.error("El título es obligatorio");
            return;
        }

        setIsSubmitting(true);

        try {
            if (!task.id) {
                throw new Error("ID de tarea no válido");
            }

            await editTask(task.id, title, description);
            toast.success("¡Tarea actualizada con éxito!");
            onClose();
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
            toast.error("Error al actualizar la tarea");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-[hsl(var(--background))] dark:opacity-80"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block align-bottom bg-[hsl(var(--background))] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-60"
                        >
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-[hsl(var(--background))] rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Cerrar</span>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="bg-[hsl(var(--background))] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-[hsl(var(--foreground))] mb-4">
                                            Editar Tarea{task?.title ? `: ${task.title}` : ""}
                                        </h3>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="edit-title"
                                                    className="block text-sm font-medium text-[hsl(var(--foreground))]"
                                                >
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    id="edit-title"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="input mt-1"
                                                    placeholder="Título de la tarea"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="edit-description"
                                                    className="block text-sm font-medium text-[hsl(var(--foreground))]"
                                                >
                                                    Descripción
                                                </label>
                                                <textarea
                                                    id="edit-description"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    rows={4}
                                                    className="input mt-1"
                                                    placeholder="Descripción de la tarea (opcional)"
                                                />
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="btn btn-primary w-full sm:ml-3 sm:w-auto"
                                                >
                                                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="btn btn-secondary mt-3 w-full sm:mt-0 sm:w-auto"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskModal;
