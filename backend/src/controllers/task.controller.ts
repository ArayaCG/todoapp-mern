import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Task from "../models/task.model";
import { AppError } from "../middlewares/error.middleware";
import logger from "../utils/logger";

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Obtener parámetros de consulta
        const { completed, priority, sort } = req.query;

        // Construir query
        let query: any = { user: req.user._id };

        // Filtrar por estado de completado si se proporciona
        if (completed !== undefined) {
            query.completed = completed === "true";
        }

        // Filtrar por prioridad si se proporciona
        if (priority) {
            query.priority = priority;
        }

        // Construir la consulta
        let taskQuery = Task.find(query);

        // Ordenar resultados
        if (sort) {
            const sortBy = (sort as string).split(",").join(" ");
            taskQuery = taskQuery.sort(sortBy);
        } else {
            taskQuery = taskQuery.sort("-createdAt"); // Por defecto, ordenar por fecha de creación descendente
        }

        // Ejecutar la consulta
        const tasks = await taskQuery;

        // Responder con las tareas
        res.status(200).json({
            status: "success",
            count: tasks.length,
            data: {
                tasks,
            },
        });

        logger.debug(`Usuario ${req.user._id} obtuvo sus tareas`);
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener una tarea por ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            next(new AppError("Tarea no encontrada", 404));
            return;
        }

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

        // Añadir el ID del usuario a la tarea
        req.body.user = req.user._id;

        // Crear la tarea
        const task = await Task.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                task,
            },
        });

        logger.info(`Usuario ${req.user._id} creó una nueva tarea: ${task._id}`);
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

        // Buscar y actualizar la tarea
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
            new: true,
            runValidators: true,
        });

        if (!task) {
            next(new AppError("Tarea no encontrada", 404));
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                task,
            },
        });

        logger.info(`Usuario ${req.user._id} actualizó la tarea: ${task._id}`);
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Buscar y eliminar la tarea
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            next(new AppError("Tarea no encontrada", 404));
            return;
        }

        res.status(200).json({
            status: "success",
            data: null,
        });

        logger.info(`Usuario ${req.user._id} eliminó la tarea: ${req.params.id}`);
    } catch (error) {
        next(error);
    }
};
