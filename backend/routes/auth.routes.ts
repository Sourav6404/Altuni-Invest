/**
 * PURPOSE:
 * Express routing bindings for Authentication endpoints.
 * 
 * INTERACTION:
 * - Mounted under app router namespaces.
 */

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register.bind(controller));
router.post("/login", controller.login.bind(controller));
router.post("/profile", controller.updateProfile.bind(controller));

export default router;
