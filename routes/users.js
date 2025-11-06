const express = require("express");

const router = express.Router();
const { validateProfileUpdate } = require("../middlewares/validation");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateProfileUpdate, updateCurrentUser);

module.exports = router;
