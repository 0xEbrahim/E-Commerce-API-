import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { uploadSingle, userImageResize } from "../config/multer.js";
import { isAllowedTo } from "../middlewares/AllowedTo.js";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/me", isAuthenticated, userController.myProfile);
router.get("/:id", userController.getUser);
router.post("/secureAccount/:email", userController.secureAccount);
router.patch(
  "/deactivateAccount",
  isAuthenticated,
  userController.deactivateAccount
);
router.patch(
  "/updateProfile",
  isAuthenticated,
  uploadSingle,
  userImageResize,
  userController.updateUserProfile
);
router.patch("/updatePassword", isAuthenticated, userController.updatePassword);
router.delete(
  "/delete",
  isAuthenticated,
  isAllowedTo("admin"),
  userController.deleteUser
);
export default router;
