const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  getClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const ClothingItem = require("../models/clothingItem");
const auth = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.get("/:itemId", getClothingItem);

// UPDATED: Authentication now occurs first for DELETE
router.delete("/:itemId", auth, deleteClothingItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
