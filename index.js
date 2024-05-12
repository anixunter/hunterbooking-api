import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";

const port = process.env.PORT || 3000;

const app = express();

const MONGODB_URL = process.env.MONGODB_URL;

const connectMongodb = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to database");
  } catch (err) {
    throw err;
  }
};

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://anixunter.github.io",
    credentials: true,
  })
);
// app.use(express.urlencoded({ extended: true }));

//routes middlwares
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

//errorhandling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(port, () => {
  connectMongodb();
  console.log("hunterbooking-api is running on render");
});
