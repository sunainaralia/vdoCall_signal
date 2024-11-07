const developmentError = (error, res) => {
  return res.status(error.errorStatus).json({
    status: error.errorStatus,
    msg: error.message,
    stackTrace: error.stack,
    error: error
  });
};

const productionError = (error, res) => {
  if (error.isOprationalError) {
    return res.status(error.errorStatus).json({
      status: error.errorStatus,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const castError = (error, res) => {
  const err = `Your ID ${error.value} is not correct for ${error.path} field`;
  return res.status(error.errorStatus).json({
    status: 400,
    message: err,
  });
};

const duplicateError = (error, res) => {
  let msg = `${error.keyValue.name} is used previously, ${Object.keys(error.keyValue)[0]} is unique`;
  return res.status(400).json({
    status: 400,
    message: msg,
  });
};

const validationError = (error, res) => {
  let msg = Object.values(error.errors);
  let err = msg.map(err => err.message);
  return res.status(400).json({
    status: 400,
    message: `Validation Error: ${err.join(". ")}`,
  });
};

const invalidTokenError = (error, res) => {
  return res.status(401).json({
    status: 401,
    message: `Token is not valid, please provide a valid token`,
  });
};

const TokenExpiredError = (error, res) => {
  return res.status(401).json({
    status: 401,
    message: "Token has expired",
  });
};

const ErrorHandling = (error, req, res, next) => {
  error.errorStatus = error.errorStatus || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === "development") {
    developmentError(error, res);
  } else {
    if (error.name === "CastError") {
      castError(error, res);
    } if (error.code === 11000) {
      duplicateError(error, res);
    } if (error.name === "ValidationError") {
      validationError(error, res);
    } if (error.name === "JsonWebTokenError") {
      invalidTokenError(error, res);
    } if (error.name === "TokenExpiredError") {
      TokenExpiredError(error, res);
    }
    productionError(error, res);
  }
};

module.exports = ErrorHandling; // Export the error handling middleware
