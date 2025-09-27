const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { signin, createUser } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");

const app = express();
app.use(cors());

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

app.use(express.json());
const auth = require("./middlewares/auth");
app.post("/signup", createUser);
app.post("/signin", signin);
app.use(auth);
app.use("/", mainRouter);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {});
