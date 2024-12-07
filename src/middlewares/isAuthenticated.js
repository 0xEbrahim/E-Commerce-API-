import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verfiyToken } from "../utils/JWT.js";
import User from "../models/userModel.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer"))
    return next(new APIError("You must be logged in to continue", 401));
  token = token.split(" ")[1];
  const decoded = await verfiyToken(token);
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new APIError(
        "This token is not valid anymore, this user maybe deleted or banned"
      )
    );

  if (
    user.passwordChangedAfter(decoded.iat) ||
    parseInt(user.lastOnline.getTime() / 1000, 10) > decoded.iat
  )
    return next(
      new APIError(
        "This token is not valid anymore, User recently changed password or logged out",
        401
      )
    );
  req.user = user;
  next();
});
