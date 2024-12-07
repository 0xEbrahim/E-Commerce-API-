import express from "express";
import { authController } from "../controllers/index.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword", authController.resetPassword);
router.patch("/confirm", authController.confirmEmail);
export default router;
