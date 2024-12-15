import express from "express";
import { categoryController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAllowedTo } from "../middlewares/AllowedTo.js";
import { categoryImageResize, uploadSingle } from "../config/multer.js";

const router = express.Router();

router.get("/", isAuthenticated, categoryController.getAllCategories);
router.post(
  "/",
  isAuthenticated,
  isAllowedTo("admin"),
  uploadSingle,
  categoryImageResize,
  categoryController.createCategory
);
router.get("/:id", isAuthenticated, categoryController.getCategory);
router.patch(
  "/:id",
  isAuthenticated,
  isAllowedTo("admin"),
  uploadSingle,
  categoryImageResize,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  isAuthenticated,
  isAllowedTo("admin"),
  categoryController.deleteCategory
);

export default router;
