import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/authRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { fileURLToPath } from "url";

import connectDB from "./db/db.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

const PORT = process.env.PORT || 7000;

app.use("/v1/auth", authRouter);
app.use("/v1/applications", applicationRouter);

app.use("/api", (req, res) => {
  console.log("API endpoint not found:", req.originalUrl);
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    requestedUrl: req.originalUrl,
  });
});

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("MONGOURI:", process.env.MONGOURI);
