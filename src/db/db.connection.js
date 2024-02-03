import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbConnectionInstance = await mongoose.connect(
      `${process.env.MOGODB_URL}${process.env.DB_NAME}`
    );

    console.log("Database Connected Succefully!");
  } catch (error) {
    console.log("Error while connecting to Database" , error);
    process.exit(1);
  }
};

export { connectDB };
