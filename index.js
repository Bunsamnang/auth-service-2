import express from "express";
import mongoose from "mongoose";
import authRoute from "./authRoute.js"; // ✅ Correct
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json());

const PORT = 5000;

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
  throw new Error("MONGO_CONNECTION_STRING is not defined");
}

app.use("/", authRoute);

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Auth service is running on port: ${PORT}`);
  });
});
