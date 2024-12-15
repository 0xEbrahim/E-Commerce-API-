import fs from "fs";
import uploader from "../config/cloudinary.js";
import Category from "../models/categoryModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIFeatures from "../utils/APIFeatures.js";
import APIError from "../utils/APIError.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  let avatar;
  let url;
  if (req.file) {
    avatar = req.file.path;
    const uploaded = await uploader(avatar);
    url = uploaded.url;
    fs.unlinkSync(avatar);
  }
  const category = await Category.create({
    title: title,
    image: url,
  });
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .fieldsLimit()
    .paginate();
  const categories = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return next(new APIError("Category not found", 404));
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  let avatar;
  let url;
  if (req.file) {
    avatar = req.file.path;
    const uploaded = await uploader(avatar);
    url = uploaded.url;
    fs.unlinkSync(avatar);
  }
  const category = await Category.findByIdAndUpdate(
    id,
    {
      title: title,
      image: url,
    },
    { new: true }
  );
  if (!category)
    return next(
      new APIError("Error while updating ther category or is not found", 404)
    );
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category)
    return next("Error while deleting the category or does not exist", 404);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
