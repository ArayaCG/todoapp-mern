import { create } from "zustand";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
}

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: () => Promise<void>;
    addTask: (title: string, description: string) => Promise<void>;
    updateTaskStatus: (id: string, completed: boolean) => Promise<void>;
    editTask: (id: string, title: string, description: string) => Promise<void>;
    removeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        const { tasks } = get();
        if (tasks.length > 0) return;

        set({ isLoading: true, error: null });
        try {
            const tasks = await getTasks();
            set({ tasks, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Error al obtener tareas",
                isLoading: false,
            });
        }
    },

    addTask: async (title, description) => {
        set({ isLoading: true, error: null });
        try {
            const newTask = await createTask(title, description);
            set((state) => ({
                tasks: [...state.tasks, newTask],
                isLoading: false,
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Error al crear tarea",
                isLoading: false,
            });
            throw error;
        }
    },

    updateTaskStatus: async (id, completed) => {
        set({ isLoading: true, error: null });
        try {
            if (!id) {
                throw new Error("ID de tarea no válido");
            }

            const task = get().tasks.find((t) => t.id === id);
            if (!task) {
                throw new Error("Tarea no encontrada");
            }

            const updatedTask = await updateTask(id, {
                ...task,
                completed,
            });

            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
                isLoading: false,
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Error al actualizar tarea",
                isLoading: false,
            });
            throw error;
        }
    },

    editTask: async (id, title, description) => {
        set({ isLoading: true, error: null });
        try {
            if (!id) {
                throw new Error("ID de tarea no válido");
            }

            const task = get().tasks.find((t) => t.id === id);
            if (!task) {
                throw new Error("Tarea no encontrada");
            }

            const updatedTask = await updateTask(id, {
                ...task,
                title,
                description,
            });

            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
                isLoading: false,
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Error al editar tarea",
                isLoading: false,
            });
            throw error;
        }
    },

    removeTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            if (!id) {
                throw new Error("ID de tarea no válido");
            }

            await deleteTask(id);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Error al eliminar tarea",
                isLoading: false,
            });
            throw error;
        }
    },
}));
