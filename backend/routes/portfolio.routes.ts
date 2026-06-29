/**
 * PURPOSE:
 * Express routing bindings for Portfolio endpoints.
 * 
 * INTERACTION:
 * - Mounted under app router namespaces.
 */

import { Router } from "express";
import { PortfolioController } from "../controllers/portfolio.controller";

const router = Router();
const controller = new PortfolioController();

router.get("/portfolio", controller.getPortfolio.bind(controller));
router.post("/portfolio", controller.addHolding.bind(controller));
router.delete("/portfolio/:id", controller.deleteHolding.bind(controller));

export default router;
