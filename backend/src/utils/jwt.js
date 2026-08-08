import jwt from "jsonwebtoken";

const EXPIRES_IN = "7d";

/**
 * Sign a JWT for the given user id.
 */
export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Set an httpOnly cookie + return the token.
 * Using both cookie and returning the token lets the frontend choose its storage strategy.
 */
export function sendToken(res, user, statusCode = 200) {
  const token = signToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  const userObj = user.toPublic ? user.toPublic() : user.toObject();

  res.status(statusCode).json({
    success: true,
    token,
    user: userObj,
  });
}
