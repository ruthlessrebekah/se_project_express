const BadRequestError = require("./errors/BadRequestError");
const UnauthorizedError = require("./errors/UnauthorizedError");
const ForbiddenError = require("./errors/ForbiddenError");
const NotFoundError = require("./errors/NotFoundError");
const ConflictError = require("./errors/ConflictError");

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const FORBIDDEN = 403;
const CONFLICT = 409;
const SERVER_ERROR = 500;

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN,
  CONFLICT,
  SERVER_ERROR,
};
