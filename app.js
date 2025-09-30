const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { signin, createUser } = require("./controllers/users");
const { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } = require("./utils/errors");
const auth = require("./middlewares/auth");

const app = express();

// Test user injection for NODE_ENV === "test"
if (process.env.NODE_ENV === "test") {
  app.use((req, res, _) => {
    req.user = { _id: process.env.TEST_USER_ID || "5d8b8592978f8bd833ca8133" };
    _();
  });
}

app.use(cors());

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

app.use(express.json());

// Public routes
app.post("/signup", createUser);
app.post("/signin", signin);
app.use("/items", require("./routes/clothingItems"));

// Protected routes
app.use(auth);
app.use("/users", require("./routes/users"));

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

app.listen(PORT, () => {});
