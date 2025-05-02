import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../middlewares/error.middleware";
import { TaskService } from "../services/task.service";

const taskService = new TaskService();

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { completed, priority, sort } = req.query;

        const userId = req.user._id;

        const tasks = await taskService.getTasks(userId, {
            completed: completed as any,
            priority: priority as string,
            sort: sort as string,
        });

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

        const task = await taskService.getTaskById(taskId, userId);

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new AppError(errors.array()[0].msg, 400));
            return;
        }

        const userId = req.user._id;

        const task = await taskService.createTask(req.body, userId);

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new AppError(errors.array()[0].msg, 400));
            return;
        }

        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await taskService.updateTask(taskId, userId, req.body);

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

        await taskService.deleteTask(taskId, userId);

        res.status(200).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
