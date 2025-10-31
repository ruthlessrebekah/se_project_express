require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { NOT_FOUND } = require("./utils/errors");
const errorHandler = require("./middlewares/error-handler");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(requestLogger);

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

app.use(express.json());

app.use(mainRouter);
app.use(errorLogger);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Celebrate error handler middleware
app.use(errors());

// Use centralized error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
