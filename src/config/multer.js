import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const diskStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  )
    cb(null, true);
  else cb({ message: "Unsupported file format" }, false);
};

const uploader = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 },
});

export const userImageResize = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${Math.random() * Date.now()}-${Date.now()}.jpeg`;
  req.file.path = `${__dirname}/../public/uploads/users/${req.file.filename}`;
  await sharp(req.file.buffer)
    .resize({ height: 500, width: 500 })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(req.file.path);
  next();
};


export const categoryImageResize = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${Math.random() * Date.now()}-${Date.now()}.jpeg`;
  req.file.path = `${__dirname}/../public/uploads/categories/${req.file.filename}`;
  await sharp(req.file.buffer)
    .resize({ height: 500, width: 500 })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(req.file.path);
  next();
};

export const productImagesResize = async (req, res, next) => {
  if (!req.files) return next();
  for (let i = 0; i < req.files.length; i++) {
    req.files[i].filename = `user-${
      Math.random() * Date.now()
    }-${Date.now()}.jpeg`;
    req.files[
      i
    ].path = `${__dirname}/../public/uploads/products/${req.files[i].filename}`;
    await sharp(req.files[i].buffer)
      .resize({ height: 1920, width: 1080 })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(req.files[i].path);
  }
  next();
};

export const uploadSingle = uploader.single("image");
export const uploadMany = uploader.array("images");
