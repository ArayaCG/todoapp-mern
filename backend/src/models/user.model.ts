import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Interfaz para el documento de usuario
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}

// Schema de usuario
const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Por favor, agrega un nombre"],
            trim: true,
            maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
        },
        email: {
            type: String,
            required: [true, "Por favor, agrega un email"],
            unique: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor, agrega un email válido"],
        },
        password: {
            type: String,
            required: [true, "Por favor, agrega una contraseña"],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
            select: false, // No incluir password en las consultas por defecto
        },
    },
    {
        timestamps: true,
    }
);

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para generar token JWT
UserSchema.methods.generateAuthToken = function (): string {
    const secret = process.env.JWT_SECRET || "secret";
    // Forzamos los tipos para que coincidan con las expectativas de la biblioteca
    const payload = { id: this._id.toString() };
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || "7d" };

    // @ts-ignore - Ignoramos los errores de tipo ya que sabemos que estos parámetros son correctos
    return jwt.sign(payload, secret, options);
};

export default mongoose.model<IUser>("User", UserSchema);
