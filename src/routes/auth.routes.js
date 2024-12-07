import express from "express";
import { authController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { uploadSingle, userImageResize } from "../config/multer.js";
const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", isAuthenticated, authController.logout);
router.post("/signup", uploadSingle, userImageResize, authController.signup);
router.post("/refresh", authController.refreshToken);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/twoFactor", authController.twoStepAuth);
router.get("/google", authController.googleAuth);
router.get(
  "/google/callback",
  authController.googleCallback,
  authController.googleCallbackRoute
);
router.patch("/resetPassword", authController.resetPassword);
router.patch("/confirm", authController.confirmEmail);
export default router;
