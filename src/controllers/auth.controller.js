import crypto from "crypto";
import { sendEmail } from "../config/sendEmail.js";
import User from "../models/userModel.js";
import { generateTemplate } from "../public/email.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  const confirmToken = user.createEmailConfirmationToken();
  await user.save();
  const html = generateTemplate(confirmToken);
  const data = {
    email: user.email,
    subject: "Email confirmation",
    html,
  };
  await sendEmail(data);
  res.status(201).json({
    status: "success",
    data: {
      user,
      confirmToken,
    },
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  if (!token)
    return next(new APIError("Provide email confirmation token.", 400));
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ emailConfirmationToken: encoded });
  if (user.emailConfirmationTokenExpired() || !user)
    return next(new APIError("Invalid or expired email confirmation token"));
  user.emailConfirmed = true;
  user.emailConfirmationToken = undefined;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Email confirmed",
  });
});

export const login = async (req, res, next) => {};
