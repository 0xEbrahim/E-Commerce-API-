import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/me", isAuthenticated, userController.myProfile);
router.get("/:id", userController.getUser);
router.patch("/updatePassword", isAuthenticated, userController.updatePassword);
export default router;
