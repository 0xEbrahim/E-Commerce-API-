import User from "../models/userModel.js";
import APIError from "../utils/APIError.js";
import APIFeatures from "../utils/APIFeatures.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const myProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("name email avatar");
  if (!user) return next(new APIError("Olease login first", 401));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .fieldsLimit()
    .paginate();
  const users = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(new APIError("User not found", 404));
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/*
  TODO: get the old password and check it first
  TODO: Send email to the user to make sure that he is the one who changed the password
*/
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new APIError("Invalid or deactivated user", 400));
  const { password } = req.body;
  user.password = password;
  await user.save();
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
