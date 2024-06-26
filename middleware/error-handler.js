const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let manipulatedErrorObj = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Uppps Something went wrong",
  };

  if (err.name === "CastError") {
    manipulatedErrorObj = {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `No item found with the id: ${err.value}`,
    };
  }
  if (err.name === "ValidationError") {
    const message = [];
    Object.keys(err.errors).forEach((key) => {
      message.push(err.errors[key].message);
    });
    manipulatedErrorObj = {
      statusCode: StatusCodes.BAD_REQUEST,
      message: message.join(", "),
    };
  }

  if (err?.code === 11000) {
    manipulatedErrorObj = {
      ...manipulatedErrorObj,
      message: `There are some issues for those fields: ${Object.keys(
        err.keyValue
      )}`,
      statusCode: StatusCodes.BAD_REQUEST,
    };
  }

  return res
    .status(manipulatedErrorObj.statusCode)
    .json({ err: manipulatedErrorObj.message });
};

module.exports = errorHandlerMiddleware;
