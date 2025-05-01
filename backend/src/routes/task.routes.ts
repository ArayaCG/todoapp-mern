import express from "express";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/task.controller";
import { taskValidator } from "../utils/validators";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Proteger todas las rutas de tareas
router.use(protect);

// Rutas para tareas
router.route("/").get(getTasks).post(taskValidator, createTask);

router.route("/:id").get(getTask).put(taskValidator, updateTask).delete(deleteTask);

export default router;
