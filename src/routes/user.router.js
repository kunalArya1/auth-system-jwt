import { Router } from "express";
import {
  homepage,
  register,
  login,
  logout,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(isLoggedIn,homepage);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);

export default router;
