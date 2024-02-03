import { Router } from "express";
import { homepage, register, login } from "../controllers/user.controllers.js";
const router = Router();

router.route("/").get(homepage);
router.route("/register").post(register);
router.route("/login").post(login);

export default router;
