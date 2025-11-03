import mongoose from "mongoose";
import { type User } from "../types/index.js";

const userSchema = new mongoose.Schema<User>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    validated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const user = mongoose.model<User>("users", userSchema);
