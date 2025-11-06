const { BAD_REQUEST, SERVER_ERROR } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  // Log the error to console
  // console.error(err);

  // Determine status code
  let statusCode = err.statusCode || SERVER_ERROR;
  let message = err.message || "An error has occurred on the server";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = BAD_REQUEST;
    message = "Invalid data provided";
  } else if (err.name === "CastError") {
    statusCode = BAD_REQUEST;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    statusCode = BAD_REQUEST;
    message = "Email already exists";
  }

  // Send error response
  res.status(statusCode).json({
    message:
      statusCode === SERVER_ERROR
        ? "An error has occurred on the server"
        : message,
  });
};

module.exports = errorHandler;
