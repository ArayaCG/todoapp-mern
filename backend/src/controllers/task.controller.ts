import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middlewares/error.middleware";
import { TaskService } from "../services/task.service";

// Instanciar el servicio de tareas
const taskService = new TaskService();

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Obtener parámetros de consulta
        const { completed, priority, sort } = req.query;

        // Obtener el ID del usuario desde el middleware de autenticación
        const userId = req.user._id;

        // Delegar al servicio
        const tasks = await taskService.getTasks(userId, {
            completed: completed as any,
            priority: priority as string,
            sort: sort as string,
        });

        // Responder con las tareas
        res.status(200).json({
            status: "success",
            count: tasks.length,
            data: {
                tasks,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener una tarea por ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        // Delegar al servicio
        const task = await taskService.getTaskById(taskId, userId);

        // Responder con la tarea
        res.status(200).json({
            status: "success",
            data: {
                task,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear una nueva tarea
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validar los datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new AppError(errors.array()[0].msg, 400));
            return;
        }

        const userId = req.user._id;

        // Delegar al servicio
        const task = await taskService.createTask(req.body, userId);

        // Responder con la tarea creada
        res.status(201).json({
            status: "success",
            data: {
                task,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar una tarea
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validar los datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new AppError(errors.array()[0].msg, 400));
            return;
        }

        const taskId = req.params.id;
        const userId = req.user._id;

        // Delegar al servicio
        const task = await taskService.updateTask(taskId, userId, req.body);

        // Responder con la tarea actualizada
        res.status(200).json({
            status: "success",
            data: {
                task,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        // Delegar al servicio
        await taskService.deleteTask(taskId, userId);

        // Responder con éxito
        res.status(200).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
