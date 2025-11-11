const router = require("express").Router();
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

// Public route
router.get("/", getClothingItems);

// Protected routes
router.use(auth);
router.post("/", validateClothingItem, createClothingItem);

router.delete("/:itemId", validateId, deleteClothingItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
