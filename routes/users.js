const router = require("express").Router();

const {
  signin,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");
router.post("/signin", signin);
router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

module.exports = router;
