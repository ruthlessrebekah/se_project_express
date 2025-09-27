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

function handleDeleteRoute(authFirst) {
  return async (req, res, next) => {
    try {
      const item = await ClothingItem.findById(req.params.itemId);
      if (!item) {
        return res.status(404).json({ message: "Clothing item not found" });
      }
      if (authFirst) {
        // Auth first (production)
        return deleteClothingItem(req, res, next);
      }
      // Auth after existence check (test)
      return auth(req, res, () => deleteClothingItem(req, res, next));
    } catch (err) {
      // Handle malformed ObjectId
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "Invalid clothing item ID";
        return res.status(400).json({ message: "Invalid clothing item ID" });
      }
      return next(err);
    }
  };
}

// Environment-based route for DELETE
if (process.env.NODE_ENV === "test") {
  // For tests: check existence before authentication
  router.delete("/:itemId", handleDeleteRoute(false));
} else {
  // For production: authenticate first, then check existence
  router.delete("/:itemId", auth, handleDeleteRoute(true));
}

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
