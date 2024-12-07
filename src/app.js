import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import rootRouter from "./routes/index.js";
import { errorHandler, unhandledRoutes } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception happened, server is about to shurtdown");
  console.log(err.name, err.message);
  process.exit(1);
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1", rootRouter);
app.all("*", unhandledRoutes);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
  connectDB();
});

process.on("unhandledRejection", (err) => {
  console.log(
    "Unhandled rejection happened, your application will be shutdown 💀"
  );
  console.log(err.name, err.message);

  server.close(() => process.exit(1));
});
