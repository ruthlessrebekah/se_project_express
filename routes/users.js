const { validateUser, validateLogin } = require("../middlewares/validation");
const router = require("express").Router();

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateUser, updateCurrentUser);

module.exports = router;
