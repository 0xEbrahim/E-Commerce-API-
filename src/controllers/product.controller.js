import fs from "fs";
import uploader from "../config/cloudinary.js";
import Product from "../models/productModel.js";
import APIError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIFeatures from "../utils/APIFeatures.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, price, description, quantity, category } = req.body;
  let images;
  let main;
  let url;
  let urls;
  if (req.files) {
    images = req.files;
    main = images[0].path;
    let mainUrl = await uploader(main);
    url = mainUrl.url;
    urls = images.length > 1 ? [] : undefined;
    fs.unlinkSync(main);
    for (let i = 1; i < images.length; i++) {
      const uploaded = await uploader(images[i].path);
      urls.push(uploaded.url);
      fs.unlinkSync(images[i].path);
    }
  }
  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    mainImage: url,
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
  const product = await Product.findById(id).populate("reviews");
  if (!product) return next(new APIError("Product not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) return next(new APIError("product not found", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, quantity, price, description } = req.body;
  let images;
  let main;
  let url;
  let urls;
  if (req.files) {
    images = req.files;
    main = images[0].path;
    let mainUrl = await uploader(main);
    url = mainUrl.url;
    urls = images.length > 1 ? [] : undefined;
    fs.unlinkSync(main);
    for (let i = 1; i < images.length; i++) {
      const uploaded = await uploader(images[i].path);
      urls.push(uploaded.url);
      fs.unlinkSync(images[i].path);
    }
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      quantity,
      price,
      description,
      mainImage: url,
      subImages: urls,
    },
    { new: true }
  );
  if (!product) return next(new APIError("Product not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});
