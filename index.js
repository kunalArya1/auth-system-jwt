import e from "express";
import { app } from "./app.js";
import { connectDB } from "./src/db/db.connection.js";
import dotenv from "dotenv";

// DotEnv Config

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🌐 App is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Connection error", err);
  });
