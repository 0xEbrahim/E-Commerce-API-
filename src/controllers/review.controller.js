import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/APIError.js";
import APIFeatures from "../utils/APIFeatures.js";

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

export const getAllReviews = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  if (!productId) productId = req.body.productId;
  const filter = {};
  if (productId) filter.product = productId;
  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .fieldsLimit()
    .paginate();
  const reviews = await features.query;
  res.status(200).json({ status: "success", data: { reviews } });
});

export const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) return next(new APIError("Review not found", 404));
  res.status(200).json({
    status: "success",
    data: { review },
  });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { rev, rating } = req.body;
  const { id } = req.params;
  const filter = {};
  if (rev) filter.review = rev;
  if (rating) filter.rating = rating;
  const review = await Review.findByIdAndUpdate(id, filter, { new: true });
  if (!review) return next(new APIError("Review not found", 404));
  res.status(200).json({
    status: "success",
    data: { review },
  });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) return next(new APIError("Review not found", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
