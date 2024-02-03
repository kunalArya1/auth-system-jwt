import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const homepage = (req, res, next) => {
  res.send("HomePage ");
};

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const alreadyRegistredUser = await User.findOne({ email: email });

  // Check whether user is already Registred
  if (alreadyRegistredUser) {
    throw new ApiError(409, "User already registred with this email");
  }

  // Create new Uaer
  const user = await User.create({
    name,
    email,
    password,
  });

  // Get registered user without password
  const registredUser = await User.findById(user._id).select("-password");

  // Chekc for error
  if (!registredUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Send Response
  return res
    .status(201)
    .json(new ApiResponse(200, registredUser, "User Registred Successfully!"));
};
