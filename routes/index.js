const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const clothingItemRouter = require("./clothingItems");
const { signin, createUser } = require("../controllers/users");

// Public auth routes
router.post("/signup", createUser);
router.post("/signin", signin);

router.use("/items", clothingItemRouter);

router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
