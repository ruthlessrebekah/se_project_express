const router = require("express").Router();
const { NotFoundError } = require("../utils/errors");
const { validateUser, validateLogin } = require("../middlewares/validation");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const clothingItemRouter = require("./clothingItems");
const { signin, createUser } = require("../controllers/users");

// Public auth routes
router.post("/signup", validateUser, createUser);
router.post("/signin", validateLogin, signin);

router.use("/items", clothingItemRouter);

router.use("/users", auth, userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
