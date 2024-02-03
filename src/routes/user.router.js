import { Router } from "express";
import { homepage, register } from "../controllers/user.controllers.js";
const router = Router();

router.route("/").get(homepage);
router.route("/register").post(register);

export default router;
