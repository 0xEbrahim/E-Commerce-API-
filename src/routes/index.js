import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import productRouter from "./product.routes.js";
import reviewRouter from "./review.routes.js";
import cartRouter from "./cart.routes.js";
import categoryRouter from "./category.routes.js";
import orderRouter from "./order.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/reviews", reviewRouter);
router.use("/cart", cartRouter);
router.use("/categories", categoryRouter);
router.use("/orders", orderRouter);

export default router;
