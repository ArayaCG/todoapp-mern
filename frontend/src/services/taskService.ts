import axios from "axios";
import api from "./api";
import type { Task } from "../store/taskStore";

interface BackendTask {
    _id: string;
    title: string;
    description?: string;
    completed?: boolean;
    createdAt: string;
}

const transformTaskFromBackend = (backendTask: BackendTask): Task => {
    return {
        id: backendTask._id,
        title: backendTask.title,
        description: backendTask.description || "",
        completed: backendTask.completed || false,
        createdAt: backendTask.createdAt,
    };
};

export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await api.get("/tasks");

        let tasksArray = [];

        if (response.data && response.data.data && response.data.data.tasks) {
            tasksArray = response.data.data.tasks;
        } else if (response.data && Array.isArray(response.data.data)) {
            tasksArray = response.data.data;
        } else if (Array.isArray(response.data)) {
            tasksArray = response.data;
        } else {
            return [];
        }

        return tasksArray.map(transformTaskFromBackend);
    } catch (error) {
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
        if (!id) {
            throw new Error("ID de tarea no válido");
        }

        const backendTaskData = {
            ...taskData,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...backendDataWithoutId } = backendTaskData;

        const response = await api.put(`/tasks/${id}`, backendDataWithoutId);

        let responseTaskData;

        if (response.data && response.data.data && response.data.data.task) {
            responseTaskData = response.data.data.task;
        } else if (response.data && response.data.data) {
            responseTaskData = response.data.data;
        } else {
            responseTaskData = response.data;
        }

        return transformTaskFromBackend(responseTaskData);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al actualizar tarea");
        }
        throw new Error("Error al conectar con el servidor");
    }
};

export const deleteTask = async (id: string): Promise<void> => {
    try {
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
