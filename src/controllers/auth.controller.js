import crypto from "crypto";
import User from "../models/userModel.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmailToken } from "../utils/sendEmailToken.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  sendEmailToken(user);
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  if (!token)
    return next(new APIError("Provide email confirmation token.", 400));
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ emailConfirmationToken: encoded });
  if (!user) {
    return next(new APIError("Invalid email confirmation token", 400));
  }
  if (user.emailConfirmationTokenExpired()) {
    sendEmailToken(user);
    return res.status(400).json({
      status: "fail",
      message:
        "Expired confirmation token, we sent you a new token, please check your email again",
    });
  }
  user.emailConfirmed = true;
  user.emailConfirmationToken = undefined;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Email confirmed",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user || !(await user.matchPassword(password)))
    return next(new APIError("Incorrect email or password", 400));
  if (!user.emailConfirmed) {
    sendEmailToken(user);
    return res.status(403).json({
      status: "fail",
      message:
        "You can't login without confirming your email address, please check you email to verfiy your account",
    });
  }
  
});
