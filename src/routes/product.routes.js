import express from "express";
import { productController } from "../controllers/index.js";
import { productImagesResize, uploadMany } from "../config/multer.js";
const router = express.Router();

router.get("/", productController.getAllProducts);
router.post(
  "/",
  uploadMany,
  productImagesResize,
  productController.createProduct
);

export default router;
