import express from "express";
import authRouter from "./auth.routes.js";

const router = express.Router();

router.use("/auth", authRouter);

export default router;
