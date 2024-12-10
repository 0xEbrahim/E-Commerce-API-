import fs from "fs";
import uploader from "../config/cloudinary.js";
import Product from "../models/productModel.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIFeatures from "../utils/APIFeatures.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, price, description, quantity, category } = req.body;
  let images;
  if (req.files) {
    images = req.files;
  }
  const main = images[0].path;
  const subs = [];
  for (let i = 1; i < images.length; i++) {
    subs.push(images[i].path);
  }
  const urls = [];
  const mainUrl = await uploader(main);
  fs.unlinkSync(main);
  for (let i = 0; i < subs.length; i++) {
    const uploaded = await uploader(subs[i]);
    urls.push(uploaded.url);
    fs.unlinkSync(subs[i]);
  }
  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    mainImage: mainUrl.url,
    subImages: urls,
    category,
  });
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .fieldsLimit()
    .paginate();
  const products = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new APIError("Product not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});
