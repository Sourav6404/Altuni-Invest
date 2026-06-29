/**
 * PURPOSE:
 * Mongoose schema and interface mappings for User profiles.
 * 
 * RESPONSIBILITIES:
 * 1. Validates structural properties of platform users.
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  apiKey: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
