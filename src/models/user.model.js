import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [5, "Name should atleat 5 character"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken:{
      type: String,
      default: "0"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    }
  );
};

userSchema.methods.createRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOEKN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOEKN_EXPIRES,
    }
  );
};
export default mongoose.model("User", userSchema);
