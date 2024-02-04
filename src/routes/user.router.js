import { Router } from "express";
import {
  homepage,
  register,
  login,
  logout,
  forgotPassword,
  forgotPasswordLink,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(isLoggedIn,homepage);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/forgot-password").get(forgotPassword);
router.route("/forgot-passowrd-link/:userid").get(forgotPasswordLink)

export default router;
