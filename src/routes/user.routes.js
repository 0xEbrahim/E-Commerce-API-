import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/:id", userController.getUser);
router.patch("/updatePassword", isAuthenticated, userController.updatePassword);
router.get("/me", isAuthenticated, userController.myProfile);
export default router;
