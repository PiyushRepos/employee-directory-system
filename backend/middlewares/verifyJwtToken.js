import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJwt = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token is required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    const user = await User.findById(payload?.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.isAdmin = user.role === "admin";

    return next();
  } catch (error) {
    console.error("Error while verifying JWT token", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired access token" });
  }
};

export default verifyJwt;
