const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const mainRouter = require("./routes/index");
const { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } = require("./utils/errors");

const app = express();

app.use(cors());
app.use(cookieParser());

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

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  const status =
    err.statusCode ||
    (err.name === "ValidationError" ? BAD_REQUEST : SERVER_ERROR);
  const code = err.code || err.name || "SERVER_ERROR";
  const message = err.message || "An error has occurred on the server";
  res.status(status).json({ code, message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
