import crypto from "crypto";
import User from "../models/userModel.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmailToken } from "../utils/sendEmailToken.js";
import {
  createAccessToken,
  createRefreshToken,
  verfiyToken,
} from "../utils/JWT.js";
import { sendPasswordToken } from "../utils/sendPasswordResetToken.js";
import { sendOTP } from "../utils/sendOTP.js";
import { sendTokenResponse } from "../utils/sendTokenResponse.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatar;
  if (req.file) avatar = req.file;
  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar.path,
  });
  await sendEmailToken(user);
  res.status(201).json({
    status: "success",
    message:
      "We sent a message to your email, please check it to confirm your email",
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  if (!token)
    return next(new APIError("Provide email confirmation token.", 400));
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    emailConfirmationToken: encoded,
    emailTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new APIError("Invalid or expired email confirmation token", 400)
    );
  }
  user.emailConfirmed = true;
  user.emailConfirmationToken = undefined;
  user.emailTokenExpires = undefined;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Email confirmed",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user || !(await user.matchPassword(password, user.password)))
    return next(new APIError("Incorrect email or password", 401));

  if (!user.emailConfirmed) {
    sendEmailToken(user);
    return res.status(403).json({
      status: "fail",
      message:
        "You can't login without confirming your email address, please check you email to verfiy your account",
    });
  }
  if (user.twoStepAuth) {
    console.log("FF");
    await sendOTP(user);
    return res.status(200).json({
      status: "success",
      message:
        "OTP code has been sent to your email, please use it to continue login",
    });
  }
  await sendTokenResponse(res, user);
});

export const twoStepAuth = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;
  const encoded = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    OTP: encoded,
    OTPExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new APIError("Invalid or expired OTP", 401));
  }
  user.OTP = undefined;
  user.OTPExpires = undefined;
  await user.save();
  await sendTokenResponse(res, user);
});

export const logout = asyncHandler(async (req, res, next) => {
  let user = req.user;
  user = await User.findById(user.id);
  user.lastOnline = Date.now() - 1000;
  await user.save();
  res.clearCookie("jwt");
  res.status("200").json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token)
    return next(new APIError("Session timed out, please login again", 401));
  const decoded = await verfiyToken(token);
  const user = await User.findById(decoded.id);
  if (!user)
    return next(new APIError("Invalid token, please try login again", 400));
  token = await createAccessToken(decoded.id);
  res.status(200).json({
    status: "success",
    token,
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user)
    return next(new APIError("There is no user with this email address", 400));
  sendPasswordToken(user);
  res.status(200).json({
    status: "success",
    message:
      "We sent a message to your email, please check it to reset your password",
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  const encoded = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: encoded,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user)
    return next(new APIError("Invalid or expired password reset token.", 400));
  const { password } = req.body;
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "password reset successfully, try to login with the new password",
  });
});
