import jwt from "jsonwebtoken";
import { promisify } from "util";

export const createAccessToken = async (id) => {
  return await jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createRefreshToken = async (id) => {
  return await jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verfiyToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};
