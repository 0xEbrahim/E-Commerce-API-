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
    },
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  if (!token)
    return next(new APIError("Provide email confirmation token.", 400));
  
});

export const login = async (req, res, next) => {};
