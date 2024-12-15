import { createAccessToken, createRefreshToken } from "./JWT.js";

export const sendTokenResponse = async (res, user) => {
  const token = await createAccessToken(user._id);
  const refreshToken = await createRefreshToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_AGE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", refreshToken, cookieOptions);
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
};
