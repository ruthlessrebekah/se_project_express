const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const getClothingItems = (req, res, next) =>
  ClothingItem.find()
    .then((items) => res.status(200).json(items))
    .catch((err) => next(err));

const createClothingItem = async (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError("Name is required"));
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
    return res.status(201).json(newItem);
  } catch (err) {
    return next(err);
  }
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
        return next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      return next(err);
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
        return next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      return next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Clothing item not found"));
      }
      if (String(item.owner) !== String(req.user._id)) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).json(deletedItem)
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
