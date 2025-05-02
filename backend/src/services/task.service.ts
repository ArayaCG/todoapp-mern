import Task from "../models/task.model";
import { AppError } from "../middlewares/error.middleware";
import logger from "../utils/logger";

interface TaskQuery {
    completed?: boolean | string;
    priority?: string;
    sort?: string;
}

export class TaskService {
    async getTasks(userId: string, queryParams: TaskQuery): Promise<any[]> {
        try {
            const { completed, priority, sort } = queryParams;

            let query: any = { user: userId };

            if (completed !== undefined) {
                query.completed = completed === true || completed === "true";
            }

            if (priority) {
                query.priority = priority;
            }

            let taskQuery = Task.find(query);

            if (sort) {
                const sortBy = (sort as string).split(",").join(" ");
                taskQuery = taskQuery.sort(sortBy);
            } else {
            }

            const tasks = await taskQuery;

            logger.debug(`Usuario ${userId} obtuvo sus tareas`);

            return tasks;
        } catch (error) {
            logger.error(`Error al obtener tareas: ${(error as Error).message}`);

            if ((error as any).name === "CastError") {
                throw new AppError("ID de usuario inválido", 400);
            }

            throw new AppError("Error al obtener tareas", 500);
        }
    }

    async getTaskById(taskId: string, userId: string): Promise<any> {
        try {
            const task = await Task.findOne({
                _id: taskId,
                user: userId,
            });

            if (!task) {
                throw new AppError("Tarea no encontrada", 404);
            }

            return task;
        } catch (error) {
            if ((error as AppError).isOperational) {
                throw error;
            }

            if ((error as any).name === "CastError") {
                throw new AppError("ID de tarea inválido", 400);
            }

            logger.error(`Error al obtener tarea: ${(error as Error).message}`);
            throw new AppError("Error al obtener tarea", 500);
        }
    }

    async createTask(taskData: any, userId: string): Promise<any> {
        try {
            taskData.user = userId;

            const task = await Task.create(taskData);

            logger.info(`Usuario ${userId} creó una nueva tarea: ${task._id}`);

            return task;
        } catch (error) {
            if ((error as any).name === "ValidationError") {
                const message = Object.values((error as any).errors)
                    .map((val: any) => val.message)
                    .join(", ");
                throw new AppError(message, 400);
            }

            logger.error(`Error al crear tarea: ${(error as Error).message}`);
            throw new AppError("Error al crear tarea", 500);
        }
    }

    async updateTask(taskId: string, userId: string, updateData: any): Promise<any> {
        try {
            const task = await Task.findOneAndUpdate({ _id: taskId, user: userId }, updateData, {
                new: true,
                runValidators: true,
            });

            if (!task) {
                throw new AppError("Tarea no encontrada", 404);
            }

            logger.info(`Usuario ${userId} actualizó la tarea: ${task._id}`);

            return task;
        } catch (error) {
            if ((error as AppError).isOperational) {
                throw error;
            }

            if ((error as any).name === "ValidationError") {
                const message = Object.values((error as any).errors)
                    .map((val: any) => val.message)
                    .join(", ");
                throw new AppError(message, 400);
            }

            if ((error as any).name === "CastError") {
                throw new AppError("ID de tarea inválido", 400);
            }

            logger.error(`Error al actualizar tarea: ${(error as Error).message}`);
            throw new AppError("Error al actualizar tarea", 500);
        }
    }

    async deleteTask(taskId: string, userId: string): Promise<void> {
        try {
            const task = await Task.findOneAndDelete({
                _id: taskId,
                user: userId,
            });

            if (!task) {
                throw new AppError("Tarea no encontrada", 404);
            }

            logger.info(`Usuario ${userId} eliminó la tarea: ${taskId}`);
        } catch (error) {
            if ((error as AppError).isOperational) {
                throw error;
            }

            if ((error as any).name === "CastError") {
                throw new AppError("ID de tarea inválido", 400);
            }

            logger.error(`Error al eliminar tarea: ${(error as Error).message}`);
            throw new AppError("Error al eliminar tarea", 500);
        }
    }
}
