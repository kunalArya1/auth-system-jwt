import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { sendMail } from "../middleware/sendEmail.middleware.js";
import jwt from "jsonwebtoken";

// Generate access and refresh token

const createAceessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    // console.log(accessToken);

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

// Logout Controller

export const logout = AsyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Sucessfull"));
});

// Forgot Password Send Link Controller
export const forgotPasswordLinkSend = AsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "-password"
  );

  if (!user) {
    throw new ApiError(404, "User with this email is not registred");
  }

  const url = `${req.protocol}://${req.get("host")}/user/forgot-passowrd-link/${
    user._id
  }`;

  sendMail(req, res, next, url);
  user.resetPasswordToken = "1";
  await user.save({ validateBeforeSave: false });

  res.json({ user, url });
});

// Forgot Password User Recive Link Controllers
export const forgotPasswordLinkGetUser = AsyncHandler(
  async (req, res, next) => {
    const user = await User.findById(req.params.userid).select("-password");

    if (!user) {
      throw new ApiError(
        400,
        "User is not rgistred with this emial ! Please Register .."
      );
    }
    user.password = req.body.password;
    await user.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          "Password Reset Succefully..! Please Login Again."
        )
      );
  }
);

// Reset Password Controller

export const resetPassword = AsyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "Please Login First");
  }
  user.password = req.body.password;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "Password Reset Successfully"));
});

// Refresh Access Token for Long Time LogIn
export const refreshAccessToken = AsyncHandler(async (req, res, next) => {
  const userRefreshToken = req.cookies.refreshToken;

  if (!userRefreshToken) {
    throw new ApiError(500, "Token Not Found | Invalid Token");
  }

  const decodedUser = await jwt.verify(
    userRefreshToken,
    process.env.REFRESH_TOEKN_SECRET
  );

  const user = await User.findById(decodedUser._id);
  if (!user) {
    throw new ApiError(
      400,
      "UnAuthorized Refresh token | Refresh Token Expried"
    );
  }

  if (userRefreshToken !== user.refreshToken) {
    throw new ApiError(404, "Invalid Token | User Not registred ");
  }

  const { accessToken, refreshToken } = await createAceessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});
