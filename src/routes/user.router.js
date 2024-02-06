import { Router } from "express";
import {
  homepage,
  register,
  login,
  logout,
  forgotPasswordLinkSend,
  forgotPasswordLinkGetUser,
  refreshAccessToken,
  resetPassword,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(isLoggedIn, homepage);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/forgot-password").get(forgotPasswordLinkSend);
router.route("/forgot-passowrd-link/:userid").get(forgotPasswordLinkGetUser);
router.route("/refrsh-access-token").post(refreshAccessToken);
router.route("/reset-password").post(isLoggedIn, resetPassword);

export default router;
