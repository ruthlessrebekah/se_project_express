const router = require("express").Router();
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");
const {
  getClothingItems,
  createClothingItem,
  getClothingItem,
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
router.get("/:itemId", getClothingItem);
router.delete("/:itemId", validateId, deleteClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
