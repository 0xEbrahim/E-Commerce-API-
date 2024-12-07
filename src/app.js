import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import rootRouter from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
  connectDB();
});
