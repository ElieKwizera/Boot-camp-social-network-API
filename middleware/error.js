const ErrorResponse = require("../util/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  if (err.name === "CastError") {
    const message = `Resource with ID ${err.value} not found`;
    error = new ErrorResponse(message, 404);
  }
  if (err.code === 11000) {
    const message = `Duplicate filed value entered`;
    error = new ErrorResponse(message, 400);
  }

  console.log(err);

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Internal server error" });
};

module.exports = errorHandler;
