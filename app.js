require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");
const rateLimiter = require("./middlewares/rateLimiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { NotFoundError } = require("./utils/errors");
const errorHandler = require("./middlewares/error-handler");

const app = express();

app.use(
  cors({
    origin: [
      "https://ruthless-wtwr-2025.jumpingcrab.com",
      "https://www.ruthless-wtwr-2025.jumpingcrab.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Accept",
      "X-Requested-With",
      "Cookie",
    ],
    optionsSuccessStatus: 204,
  })
);

app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());
app.use(rateLimiter);

const { PORT = 3001 } = process.env;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to MongoDB successfully");
  })
  .catch(() => {
    // console.error("MongoDB connection error:", err.message);
  });

app.use(express.json());

// Remove this code after passing test review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(mainRouter);
app.use(errorLogger);

// Celebrate error handler middleware
app.use(errors());

// Use centralized error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});
