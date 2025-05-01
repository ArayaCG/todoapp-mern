import type React from "react";

import { useState } from "react";
import { useTaskStore, type Task } from "../store/taskStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteTaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ task, isOpen, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { removeTask } = useTaskStore();

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await removeTask(task.id);
            toast.success("Tarea eliminada con éxito");
            onClose();
        } catch (error) {
            toast.error("Error al eliminar la tarea");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative"
                        >
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Cerrar</span>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Eliminar tarea</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Estás seguro de que deseas eliminar la tarea "{task.title}"? Esta
                                                acción no se puede deshacer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="btn btn-danger sm:ml-3 sm:w-auto"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Eliminando..." : "Eliminar"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary mt-3 sm:mt-0 sm:w-auto"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteTaskModal;
