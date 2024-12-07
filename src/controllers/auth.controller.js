import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const login = async (req, res, next) => {};
