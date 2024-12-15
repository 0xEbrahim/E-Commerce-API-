import express from "express";
import reviewRouter from "./review.routes.js";
import { productController } from "../controllers/index.js";
import { productImagesResize, uploadMany } from "../config/multer.js";
const router = express.Router();

router.use("/:productId/reviews/", reviewRouter);
router.get("/", productController.getAllProducts);
router.post(
  "/",
  uploadMany,
  productImagesResize,
  productController.createProduct
);
router.get("/:id", productController.getProduct);
router.delete("/:id", productController.deleteProduct);
router.patch(
  "/:id",
  uploadMany,
  productImagesResize,
  productController.updateProduct
);
export default router;
