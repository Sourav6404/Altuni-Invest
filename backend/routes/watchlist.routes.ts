/**
 * PURPOSE:
 * Express routing bindings for Watchlist endpoints.
 * 
 * INTERACTION:
 * - Mounted under app router namespaces.
 */

import { Router } from "express";
import { WatchlistController } from "../controllers/watchlist.controller";

const router = Router();
const controller = new WatchlistController();

router.get("/watchlist", controller.getWatchlist.bind(controller));
router.post("/watchlist", controller.addWatchlistItem.bind(controller));
router.delete("/watchlist/:ticker", controller.deleteWatchlistItem.bind(controller));

export default router;
