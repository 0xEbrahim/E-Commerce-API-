import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import productRouter from "./product.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("products", productRouter);

export default router;
