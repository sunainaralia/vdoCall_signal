class CustomErrorHandler extends Error {
  constructor(errorMsg, errorStatus) {
    super(errorMsg);
    this.errorStatus = errorStatus;
    this.status = (this.errorStatus > 400 && this.errorStatus < 500) ? 'fail' : 'error';
    this.isOprationalError = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomErrorHandler;