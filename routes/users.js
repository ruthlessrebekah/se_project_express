const express = require("express");

const router = express.Router();
const { validateUser } = require("../middlewares/validation");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateUser, updateCurrentUser);

module.exports = router;
