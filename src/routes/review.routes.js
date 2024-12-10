import express from "express";
import { reviewController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router({ mergeParams: true });

router.get("/", reviewController.getAllReviews);
router.post("/", isAuthenticated, reviewController.createReview);
router.get("/:id", reviewController.getReview);
router.patch("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
export default router;
