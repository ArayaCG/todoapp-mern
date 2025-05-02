import type React from "react";
import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const TaskForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addTask } = useTaskStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("El título es obligatorio");
            return;
        }

        setIsSubmitting(true);

        try {
            await addTask(title, description);
            toast.success("¡Tarea creada con éxito!");
            setTitle("");
            setDescription("");
        } catch (error) {
            toast.error("Error al crear la tarea");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                >
                    Título
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input mt-1"
                    placeholder="Título de la tarea"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                >
                    Descripción
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="input mt-1"
                    placeholder="Descripción de la tarea (opcional)"
                />
            </div>

            <div>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                    {isSubmitting ? "Creando..." : "Crear Tarea"}
                </button>
            </div>
        </motion.form>
    );
};

export default TaskForm;
