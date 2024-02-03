import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

// Generate access and refresh token

const createAceessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    console.log(accessToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error While creatintg Acess and Refresh Token");
  }
};

// Homepage Controllers
export const homepage = (req, res, next) => {
  res.send("HomePage ");
};

// Register Controller
export const register = AsyncHandler(async (req, res, next) => {
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
});

// Login Controller

export const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check whether user is registed with this email or not

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(404, "User is not Registred with this Email");
  }

  // Check for password

  const vaildPassword = await user.isPasswordCorrect(password);

  // If Password is not Correct
  if (!vaildPassword) {
    throw new ApiError(401, "Invalid Password ! Try angain..");
  }

  // Generate access and refresh token

  const { accessToken, refreshToken } = await createAceessAndRefreshToken(
    user._id
  );

  // Get LoggdIn user
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Login Succesfully"
      )
    );
});
