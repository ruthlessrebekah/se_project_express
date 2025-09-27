const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const mainRouter = require("./routes/index");
const { signin, createUser } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");
const auth = require("./middlewares/auth");

const app = express();

if (process.env.NODE_ENV === "test") {
  app.use((req, res, next) => {
    req.user = { _id: process.env.TEST_USER_ID || "5d8b8592978f8bd833ca8133" };
    next();
  });
}

app.use(cors());

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

app.use(express.json());

app.post("/signup", createUser); // Public
app.post("/signin", signin); // Public
app.use(auth); // All routes below require auth
app.use("/", mainRouter);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  const message = err.message || "An error has occurred on the server";
  res.status(status).json({ message });
});

app.listen(PORT, () => {});
