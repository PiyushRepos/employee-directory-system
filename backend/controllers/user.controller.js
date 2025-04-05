import { registerSchema } from "../Schema/schema.js";
import catchErrors from "../utils/catchErrors.js";
import User from "../models/user.model.js";

export const registerHandler = catchErrors(async (req, res) => {
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
