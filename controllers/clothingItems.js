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
    error.statusCode = BAD_REQUEST;
    error.code = "VALIDATION_ERROR";
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
    return null;
  } catch (err) {
    next(err);
    return null;
  }
};

const getClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const customError = new Error("Clothing item not found");
        customError.statusCode = NOT_FOUND;
        customError.code = "NOT_FOUND";
        return next(customError);
      }
      if (err.name === "CastError") {
        const customError = new Error("Invalid clothing item ID");
        customError.statusCode = BAD_REQUEST;
        customError.code = "BAD_REQUEST";
        return next(customError);
      }
      const customError = new Error("An error has occurred on the server");
      customError.statusCode = SERVER_ERROR;
      customError.code = "SERVER_ERROR";
      return next(customError);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const customError = new Error("Clothing item not found");
        customError.statusCode = NOT_FOUND;
        customError.code = "NOT_FOUND";
        return next(customError);
      }
      if (err.name === "CastError") {
        const customError = new Error("Invalid clothing item ID");
        customError.statusCode = BAD_REQUEST;
        customError.code = "BAD_REQUEST";
        return next(customError);
      }
      const customError = new Error("An error has occurred on the server");
      customError.statusCode = SERVER_ERROR;
      customError.code = "SERVER_ERROR";
      return next(customError);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const customError = new Error("Clothing item not found");
        customError.statusCode = NOT_FOUND;
        customError.code = "NOT_FOUND";
        return next(customError);
      }
      if (err.name === "CastError") {
        const customError = new Error("Invalid clothing item ID");
        customError.statusCode = BAD_REQUEST;
        customError.code = "BAD_REQUEST";
        return next(customError);
      }
      const customError = new Error("An error has occurred on the server");
      customError.statusCode = SERVER_ERROR;
      customError.code = "SERVER_ERROR";
      return next(customError);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        const error = new Error("Clothing item not found");
        error.statusCode = NOT_FOUND;
        error.code = "NOT_FOUND";
        return next(error);
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
        const customError = new Error("Invalid clothing item ID");
        customError.statusCode = BAD_REQUEST;
        customError.code = "BAD_REQUEST";
        return next(customError);
      }
      const customError = new Error("An error has occurred on the server");
      customError.statusCode = SERVER_ERROR;
      customError.code = "SERVER_ERROR";
      return next(customError);
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
