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
        set({ isLoading: true, error: null });
        try {
            const tasks = await getTasks();
            console.log("Tareas obtenidas:", tasks);
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
            // Verificar que el ID no es undefined
            if (!id) {
                throw new Error("ID de tarea no válido");
            }

            console.log(`Actualizando estado de tarea ${id} a ${completed}`);

            const task = get().tasks.find((t) => t.id === id);
            if (!task) {
                throw new Error("Tarea no encontrada");
            }

            console.log("Tarea encontrada:", task);

            const updatedTask = await updateTask(id, {
                ...task,
                completed,
            });

            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
                isLoading: false,
            }));
        } catch (error) {
            console.error("Error al actualizar estado:", error);
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
            // Verificar que el ID no es undefined
            if (!id) {
                throw new Error("ID de tarea no válido");
            }

            console.log(`Editando tarea ${id}`);

            const task = get().tasks.find((t) => t.id === id);
            if (!task) {
                throw new Error("Tarea no encontrada");
            }

            console.log("Tarea a editar:", task);

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
            console.error("Error al editar tarea:", error);
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
            // Verificar que el ID no es undefined
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
