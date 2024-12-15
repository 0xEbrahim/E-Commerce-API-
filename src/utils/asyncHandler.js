import APIError from "./APIError.js";

export const asyncHandler = (fn) => {
  return (req, res, next) =>
    fn(req, res, next).catch((err) => next(new APIError(err.message, 500)));
};
