import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res
      .status(404)
      .json({ success: false, message: "Access token is required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    console.error("Error while verifying jwt token", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired access token" });
  }
};

export default verifyJwt;
