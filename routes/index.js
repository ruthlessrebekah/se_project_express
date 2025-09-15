const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/items", clothingItemRouter);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
