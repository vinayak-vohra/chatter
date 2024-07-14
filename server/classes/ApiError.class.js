export default class ApiError extends Error {
  constructor(
    status = 500,
    message = "An Unknown Error has Occurred",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;

    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
