import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/me", isAuthenticated, userController.myProfile);
router.patch("/updatePassword", isAuthenticated, userController.updatePassword);
export default router;
