import axios from "axios";
import api from "./api";
import type { Task } from "../store/taskStore";

// Función auxiliar para transformar tareas del backend al formato frontend
// Definir la interfaz para la estructura de la tarea del backend
interface BackendTask {
    _id: string;
    title: string;
    description?: string;
    completed?: boolean;
    createdAt: string;
}

const transformTaskFromBackend = (backendTask: BackendTask): Task => {
    return {
        id: backendTask._id, // Mapear _id del backend a id del frontend
        title: backendTask.title,
        description: backendTask.description || "",
        completed: backendTask.completed || false,
        createdAt: backendTask.createdAt,
    };
};

export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await api.get("/tasks");
        console.log("Respuesta de getTasks:", response.data);

        let tasksArray = [];

        // Verificar la estructura de la respuesta
        if (response.data && response.data.data && response.data.data.tasks) {
            tasksArray = response.data.data.tasks;
        } else if (response.data && Array.isArray(response.data.data)) {
            tasksArray = response.data.data;
        } else if (Array.isArray(response.data)) {
            tasksArray = response.data;
        } else {
            console.error("Formato de respuesta inesperado:", response.data);
            return []; // Devolver array vacío en vez de fallar
        }

        // Transformar cada tarea para asegurar mapeo correcto de _id a id
        return tasksArray.map(transformTaskFromBackend);
    } catch (error) {
        console.error("Error en getTasks:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al obtener tareas");
        }
        throw new Error("Error al conectar con el servidor");
    }
};

export const getTask = async (id: string): Promise<Task> => {
    try {
        const response = await api.get(`/tasks/${id}`);

        let taskData;

        // Verificar la estructura de la respuesta
        if (response.data && response.data.data && response.data.data.task) {
            taskData = response.data.data.task;
        } else if (response.data && response.data.data) {
            taskData = response.data.data;
        } else {
            taskData = response.data;
        }

        return transformTaskFromBackend(taskData);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al obtener tarea");
        }
        throw new Error("Error al conectar con el servidor");
    }
};

export const createTask = async (title: string, description: string): Promise<Task> => {
    try {
        const response = await api.post("/tasks", { title, description });

        let taskData;

        // Verificar la estructura de la respuesta
        if (response.data && response.data.data && response.data.data.task) {
            taskData = response.data.data.task;
        } else if (response.data && response.data.data) {
            taskData = response.data.data;
        } else {
            taskData = response.data;
        }

        return transformTaskFromBackend(taskData);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al crear tarea");
        }
        throw new Error("Error al conectar con el servidor");
    }
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
        // Asegurarse de que el id nunca sea undefined
        if (!id) {
            throw new Error("ID de tarea no válido");
        }

        console.log("Actualizando tarea con ID:", id);
        console.log("Datos para actualizar:", taskData);

        // Convertir datos del frontend a formato de backend antes de enviar
        const backendTaskData = {
            ...taskData,
            // Excluimos el id explícitamente en lugar de eliminarlo después
        };

        // TypeScript seguro: crear un nuevo objeto sin la propiedad id
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...backendDataWithoutId } = backendTaskData;

        const response = await api.put(`/tasks/${id}`, backendDataWithoutId);

        let responseTaskData;

        // Verificar la estructura de la respuesta
        if (response.data && response.data.data && response.data.data.task) {
            responseTaskData = response.data.data.task;
        } else if (response.data && response.data.data) {
            responseTaskData = response.data.data;
        } else {
            responseTaskData = response.data;
        }

        return transformTaskFromBackend(responseTaskData);
    } catch (error) {
        console.error("Error al actualizar tarea:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al actualizar tarea");
        }
        throw new Error("Error al conectar con el servidor");
    }
};

export const deleteTask = async (id: string): Promise<void> => {
    try {
        // Asegurarse de que el id nunca sea undefined
        if (!id) {
            throw new Error("ID de tarea no válido");
        }

        await api.delete(`/tasks/${id}`);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al eliminar tarea");
        }
        throw new Error("Error al conectar con el servidor");
    }
};
