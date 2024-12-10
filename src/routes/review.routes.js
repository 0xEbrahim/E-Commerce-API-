import express from "express";
import { reviewController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router({ mergeParams: true });

router.post("/", isAuthenticated, reviewController.createReview);

export default router;
