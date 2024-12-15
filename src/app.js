import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import ExpressMongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import passport from "./config/passport.js";
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

/**
 * TODO: Add rate limiter
 * TODO: Add sanitizer
 * TODO: prevent parameter pollution
 * TODO: logging
 */

/**
 *  TODO: Add application validation
 */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try afain in an hour!",
});

app.use("/api", limiter);
app.use(helmet());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(ExpressMongoSanitize());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "10kb" }));
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

export default app;
