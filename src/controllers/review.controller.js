import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/APIError.js";

export const createReview = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  if (!productId) productId = req.body.productId;
  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);
  if (!user) return next(new APIError("Invalid user, try log in again", 400));
  if (!product) return next(new APIError("Product not found", 404));
  const { rev, rating } = req.body;
  const review = await Review.create({
    review: rev,
    rating: rating,
    user: user._id,
    product: product._id,
  });
  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});
