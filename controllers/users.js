const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};
const signin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // Set the JWT as an HTTP-only cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (
        err.message === "Incorrect email or password" ||
        (err.message && err.message.includes("Incorrect email or password"))
      ) {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError("Name, email, and password are required"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(200).send({ ...user.toObject(), password: undefined });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  signin,
  updateCurrentUser,
};
