const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  SERVER_ERROR,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.status(200).json(items))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" })
    );
};

const createClothingItem = async (req, res, next) => {
  // Validation: ensure name is provided
  if (!req.body.name) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    return next(error);
  }
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    const newItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
};

const getClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid clothing item ID" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid clothing item ID" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND)
          .json({ message: "Clothing item not found" });
      }
      if (String(item.owner) !== String(req.user._id)) {
        return res
          .status(FORBIDDEN)
          .json({ message: "You do not have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).json(deletedItem)
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "Invalid clothing item ID";
      }
      next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  getClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
