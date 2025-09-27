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

router.delete("/:itemId", async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Clothing item not found" });
    }
    // Authenticate only if item exists
    auth(req, res, () => deleteClothingItem(req, res, next));
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid clothing item ID" });
    }
    return next(err);
  }
});

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
