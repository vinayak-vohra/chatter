import { MongooseError } from "mongoose";
import { FirebaseAppError } from "firebase-admin/app";

import ApiError from "../classes/ApiError.class.js";

/**
 *
 * @param {any} error Error while handling request
 * @param {import('express').Request} _req Express Request Object
 * @param {import('express').Response} res Express Response Object
 * @param {import('express').NextFunction} _next Express Next Function
 */
export async function errorHandler(error, _req, res, _next) {
  // error is not ApiError
  if (!(error instanceof ApiError)) {
    let status, message;
    // Mongoose Error
    if (error instanceof MongooseError) {
      status = 400;
      message = error.name;
    }

    // Firebase Error
    else if (error instanceof FirebaseAppError) {
      status = 403;
      message = error.code;
    }

    // create ApiError object
    error = new ApiError(status, message, [], error.stack);
  }

  const response = {
    ...error,
    message: error.message,

    // send error stack in dev mode
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  if (process.env.NODE_ENV === "development") console.log(error);

  return res.status(error.status).json(response);
}
