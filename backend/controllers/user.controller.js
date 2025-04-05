import { loginSchema, registerSchema } from "../Schema/schema.js";
import catchErrors from "../utils/catchErrors.js";
import User from "../models/user.model.js";

export const registerHandler = catchErrors(async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const data = registerSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      success: false,
      error: { message: data.error.issues[0].message },
    });
  }

  const {
    data: { email, fullName, password },
  } = data;

  let newUser;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    newUser = new User({
      fullName,
      email,
      password,
    });

    await newUser.save();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error while registering user" });
  }

  newUser = newUser.toObject();
  delete newUser.password;

  return res.status(200).json({ success: true, data: newUser });
});

export const loginHandler = catchErrors(async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const data = loginSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      success: false,
      error: { message: data.error.issues[0].message },
    });
  }

  const {
    data: { email, password },
  } = data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const accessToken = user.generateAccessToken();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ success: true, data: loggedInUser });
  } catch (error) {
    console.log("Error while logging user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
