import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import connection from "./DataBase/connection.js";

import { AppError } from "./src/utilities/AppError.js";
import cookieParser from "cookie-parser";
import { app, server } from "./src/services/socket.js";
import userRoutes from "./src/Routes/user.routes.js";

import tagRoutes from "./src/Routes/tag.routes.js";
import voacationRoutes from "./src/Routes/vocation.routes.js";
import projectRoutes from "./src/Routes/project.routes.js";

connection();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Your React app's URL
    credentials: true, // 🔥 Required to send/receive cookies
  })
);
app.use(cors());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tag", tagRoutes);
app.use("/api/v1/vocation", voacationRoutes);
app.use("/api/v1/project", projectRoutes);
// handle foriegn routes
app.all("*", (req, res, next) => {
  next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

//global handle error
app.use((err, req, res, next) => {
  console.error(err); // For debugging
  res.status(err.statusCode || 500).json({
    success: false,
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

server.listen(3001, () => {
  console.log("server on port 3001");
});
