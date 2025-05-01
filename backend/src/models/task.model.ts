import mongoose, { Schema, Document } from "mongoose";

// Interfaz para el documento de tarea
export interface ITask extends Document {
    title: string;
    description?: string;
    completed: boolean;
    user: mongoose.Schema.Types.ObjectId;
    dueDate?: Date;
    priority?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema de tarea
const TaskSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Por favor, agrega un título para la tarea"],
            trim: true,
            maxlength: [100, "El título no puede tener más de 100 caracteres"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "La descripción no puede tener más de 500 caracteres"],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dueDate: {
            type: Date,
        },
        priority: {
            type: String,
            enum: ["baja", "media", "alta"],
            default: "media",
        },
    },
    {
        timestamps: true,
    }
);

// Índices para mejorar las consultas
TaskSchema.index({ user: 1, createdAt: -1 });
TaskSchema.index({ user: 1, completed: 1 });

export default mongoose.model<ITask>("Task", TaskSchema);
