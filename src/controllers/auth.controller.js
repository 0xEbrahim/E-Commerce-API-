import crypto from "crypto";
import fs from "fs";
import passport from "passport";
import User from "../models/userModel.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmailToken } from "../utils/sendEmailToken.js";
import { createAccessToken, verfiyToken } from "../utils/JWT.js";
import { sendPasswordToken } from "../utils/sendPasswordResetToken.js";
import { sendOTP } from "../utils/sendOTP.js";
import { sendTokenResponse } from "../utils/sendTokenResponse.js";
import uploader from "../config/cloudinary.js";
import { sendReactiveAccount } from "../utils/sendReactiveEmail.js";

/**
 * @method signup
 * Registers a new user and sends an email confirmation token.
 *
 * @param {Object} req - Express request object containing name, email, password, and optionally a file for the user's avatar.
 * @param {Object} res - Express response object to confirm successful registration.
 * @param {Function} next - Express next middleware for error handling.
 * @url POST /api/v1/auth/signup
 * Creates a new user with the provided details and stores their avatar if uploaded.
 * Sends an email confirmation token to the user's email address.
 */

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatar;
  let uploaded;
  let url;
  if (req.file) {
    avatar = req.file.path;
    uploaded = await uploader(req.file.path);
    url = uploaded.url;
    fs.unlinkSync(avatar);
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: url,
    lastOnline: Date.now() - 1000,
    passwordChangedAt: Date.now() - 1000,
  });
  await sendEmailToken(user);
  res.status(201).json({
    status: "success",
    message:
      "We sent a message to your email, please check it to confirm your email",
  });
});

/**
 * @method confirmEmail
 * Confirms a user's email address using a valid email confirmation token.
 *
 * @param {Object} req - Express request object containing the email confirmation token in the query.
 * @param {Object} res - Express response object to confirm successful email verification.
 * @param {Function} next - Express next middleware for error handling.
 * @url PATCH /api/v1/auth/confirm?token=
 *
 * Verifies the email confirmation token and its expiration. Updates the user's email confirmation status if valid.
 * Returns an error if the token is invalid or expired.
 */

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

/**
 * @method login
 * Authenticates a user based on email and password, with additional checks for email confirmation and two-step authentication.
 *
 * @param {Object} req - Express request object containing email and password in the body.
 * @param {Object} res - Express response object to handle authentication responses.
 * @param {Function} next - Express next middleware for error handling.
 * @url POST /api/v1/auth/login
 *
 * Verifies the user's credentials and checks if the email is confirmed. If two-step authentication is enabled,
 * sends an OTP for further verification. Otherwise, sends an authentication token upon successful login.
 * Returns errors for invalid credentials or unverified accounts.
 */

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user || !(await user.matchPassword(password, user.password)))
    return next(new APIError("Incorrect email or password", 401));
  if (!user.isActive) {
    if (Date.now() < user.reactiveBefore) {
      await sendReactiveAccount(user);
    } else {
      return next(
        new APIError("This account might be deleted or not found", 400)
      );
    }
  }
  if (!user.emailConfirmed) {
    sendEmailToken(user);
    return res.status(403).json({
      status: "fail",
      message:
        "You can't login without confirming your email address, please check your email to verfiy your account",
    });
  }
  if (user.twoStepAuth) {
    await sendOTP(user);
    return res.status(200).json({
      status: "success",
      message:
        "OTP code has been sent to your email, please use it to continue login",
    });
  }
  await sendTokenResponse(res, user);
});

/**
 * @method twoStepAuth
 * Handles two-step authentication by verifying a provided OTP.
 *
 * @param {Object} req - Express request object containing the OTP in the body.
 * @param {Object} res - Express response object to send authentication response.
 * @param {Function} next - Express next middleware for error handling.
 * @url POST /api/v1/auth/twoFactor
 *
 * Verifies the hashed OTP and checks its expiration. If valid, clears the OTP
 * and sends a token response. Returns an error if the OTP is invalid or expired.
 */

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

/**
 * Logout the current user and delete cookies
 * @param {Object} req - Express request object containing the JWT in cookies.
 * @param {Object} res - Express response object to send the new token.
 * @param {Function} next - Express next middleware for error handling.
 * @url POST /api/v1/auth/logout
 *
 */
export const logout = asyncHandler(async (req, res, next) => {
  let user = req.user;
  user = await User.findById(user._id);
  user.lastOnline = Date.now() - 1000;
  await user.save();
  res.clearCookie("jwt");
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

/**
 * Refreshes the access token using a JWT stored in cookies.
 * @param {Object} req - Express request object containing the JWT in cookies.
 * @param {Object} res - Express response object to send the new token.
 * @param {Function} next - Express next middleware for error handling.
 * @url POST /api/v1/auth/refresh
 *
 */

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

/**
 * @method forgotPassword
 * Initiates the password reset process by sending a reset token to the user's email.
 *
 * @param {Object} req - Express request object containing the user's email in the body.
 * @param {Object} res - Express response object to confirm the token was sent.
 * @param {Function} next - Express next middleware for error handling.
 * @url POST /api/v1/auth/forgotPassword
 *
 * Checks if the user exists for the provided email. Sends a password reset token if valid.
 * Returns an error if no user is found with the given email.
 */

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

/**
 * @method resetPassword
 * Resets the user's password using a valid reset token.
 *
 * @param {Object} req - Express request object containing the reset token in the query and new password in the body.
 * @param {Object} res - Express response object to confirm successful password reset.
 * @param {Function} next - Express next middleware for error handling.
 * @url PATCH /api/v1/auth/resetPassword
 *
 * Verifies the hashed reset token and checks its expiration. Updates the user's password, clears the token,
 * and sends a success response. Returns an error if the token is invalid or expired.
 */

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

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

export const googleCallbackRoute = async (req, res, next) => {
  const token = await createAccessToken(req.user._id);
  res.cookie("x-auth-cookie", token, {
    maxAge: 5 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.redirect("http://localhost:5000/api/v1/users/me");
};
