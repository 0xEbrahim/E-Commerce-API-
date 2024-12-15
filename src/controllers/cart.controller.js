import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addToCart = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) return next(new APIError("You must be logged in", 401));
  const product = await Product.findById(id);
  if (!product) return next(new APIError("Product not found", 404));
  let cart = await Cart.findOne({ user: user._id });
  if (!cart) {
    cart = await Cart.create({
      user: user._id,
      items: [{ product: product, price: product.price }],
    });
  } else {
    const prodIndex = cart.items.findIndex(
      (el) => el.product.toString() === id
    );
    if (prodIndex > -1) {
      const item = cart.items[prodIndex];
      item.quantity += 1;
      cart.items[prodIndex] = item;
    } else {
      cart.items.push({ product: product, price: product.price });
    }
  }
  cart = await cart.save();
  res.status(201).json({
    status: "success",
    data: {
      cart,
    },
  });
});

export const getCurrentUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json({
    status: "success",
    data: { cart },
  });
});

export const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        items: {
          _id: id,
        },
      },
    },
    { new: true }
  );
  if (!cart)
    return next(new APIError("Error while removing item from your cart", 400));
  res.status(200).json({
    status: "success",
    data: { cart },
  });
});

export const updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart)
    return next(new APIError("Error while updating item from your cart", 400));
  const index = cart.items.findIndex((el) => el._id.toString() === id);
  if (index > -1) {
    cart.items[index].quantity = quantity;
  } else {
    return next(new APIError("Item not found", 404));
  }
  cart = await cart.save();
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) return next(new APIError("Cannot find cart or user", 404));
  res.status(204).json({ status: "success", data: null });
});
