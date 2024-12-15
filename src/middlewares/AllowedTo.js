import APIError from "../utils/APIError.js";

export const isAllowedTo =
  (...roles) =>
  (req, res, next) => {
    const user = req.user;
    if (!user)
      return next(
        new APIError("You have to be logged in, in order to continue", 401)
      );
    if (!roles.includes(user.role))
      return next(new APIError("Unauthorized", 403));
    next();
  };
