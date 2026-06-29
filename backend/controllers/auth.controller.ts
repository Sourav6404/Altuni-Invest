/**
 * PURPOSE:
 * Express controller for user authentication and settings profile updates.
 * 
 * RESPONSIBILITIES:
 * 1. Handles registration, password hashing, and token signature.
 * 2. Authenticates emails and credentials for logins.
 * 3. Updates user details inside MongoDB.
 */

import { Request, Response } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "altuni_jwt_secret_key_987";

export class AuthController {
  // 1. POST /api/auth/register
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          error: "Request body parameters 'name', 'email', and 'password' are required."
        });
        return;
      }

      const lowerEmail = email.toLowerCase().trim();

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: lowerEmail });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: "An account is already registered with this email address."
        });
        return;
      }

      // Hash password and assign apiKey
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const apiKey = "at_" + Math.random().toString(36).substring(2, 10).toUpperCase();

      const newUser = new UserModel({
        name: name.trim(),
        email: lowerEmail,
        password: hashedPassword,
        apiKey
      });

      const savedUser = await newUser.save();

      // Sign JWT token
      const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: "30d" });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            apiKey: savedUser.apiKey
          }
        }
      });
    } catch (error: any) {
      console.error("[AuthController] Register error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to register new account."
      });
    }
  }

  // 2. POST /api/auth/login
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: "Request body parameters 'email' and 'password' are required."
        });
        return;
      }

      const lowerEmail = email.toLowerCase().trim();

      // Find user
      const user = await UserModel.findOne({ email: lowerEmail });
      if (!user) {
        res.status(401).json({
          success: false,
          error: "Invalid email credentials or password."
        });
        return;
      }

      // Check password
      const match = await bcrypt.compare(password, user.password || "");
      if (!match) {
        res.status(401).json({
          success: false,
          error: "Invalid email credentials or password."
        });
        return;
      }

      // Sign JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            apiKey: user.apiKey
          }
        }
      });
    } catch (error: any) {
      console.error("[AuthController] Login error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to log in."
      });
    }
  }

  // 3. POST /api/auth/profile -> Update details
  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, currentEmail } = req.body;

      if (!currentEmail) {
        res.status(400).json({
          success: false,
          error: "Current user context email identifier parameter required."
        });
        return;
      }

      const user = await UserModel.findOne({ email: currentEmail.toLowerCase().trim() });
      if (!user) {
        res.status(444).json({
          success: false,
          error: "User not found."
        });
        return;
      }

      if (name) user.name = name.trim();
      if (email) user.email = email.toLowerCase().trim();
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      const saved = await user.save();

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: saved._id,
            name: saved.name,
            email: saved.email,
            apiKey: saved.apiKey
          }
        }
      });
    } catch (error: any) {
      console.error("[AuthController] Update profile error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update profile settings."
      });
    }
  }
}
