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
  if (!error instanceof ApiError) {
    // Mongoose Error
    if (error instanceof MongooseError) {
      error.status = 400;
      error.message = error.name;
    }

    // Firebase Error
    if (error instanceof FirebaseAppError) {
      error.status = 403;
      error.message = error.code;
    }

    // create ApiError object
    error = new ApiError(...error);
  }

  const response = {
    ...error,
    message: error.message,

    // send error stack in dev mode
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.status).json(response);
}
