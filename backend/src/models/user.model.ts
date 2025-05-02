import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}

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
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

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

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateAuthToken = function (): string {
    const secret = process.env.JWT_SECRET || "secret";
    const payload = { id: this._id.toString() };
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || "7d" };
    // @ts-ignore
    return jwt.sign(payload, secret, options);
};

export default mongoose.model<IUser>("User", UserSchema);
