import express from "express";
import { cartController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, cartController.getCurrentUserCart);
router.delete("/", isAuthenticated, cartController.clearCart);
router.post("/:id", isAuthenticated, cartController.addToCart);
router.delete("/:id", isAuthenticated, cartController.removeItemFromCart);
router.patch("/:id", isAuthenticated, cartController.updateItemQuantity);
export default router;
