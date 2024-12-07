import User from "../models/userModel.js";
import APIError from "../utils/APIError.js";
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
