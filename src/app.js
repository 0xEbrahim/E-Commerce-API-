import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import rootRouter from "./routes/index.js";
import { errorHandler, unhandledRoutes } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1", rootRouter);
app.all("*", unhandledRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
  connectDB();
});
