import jwt from "jsonwebtoken";

export const createAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET,{
    
  });
};
