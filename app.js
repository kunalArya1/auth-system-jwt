import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
const app = express();

// body parser
app.use(express.json({ limit: "18kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "18kb",
  })
);

// Cookie parser
app.use(cookieParser());

// Static file
app.use(express.static("public"));

// cors
app.use(cors());

// Logger Setup
app.use(logger("tiny"));

// Router setup

import userRouter from "./src/routes/user.router.js";
import router from "./src/routes/user.router.js";
import { generatedErrors } from "./src/utils/errors.js";

app.use('/user', userRouter);

app.use(generatedErrors)

export { app };
