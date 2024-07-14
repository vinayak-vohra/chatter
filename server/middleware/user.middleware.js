import firebase from "firebase-admin";

import ApiError from "../classes/ApiError.class.js";

/**
 *
 * @param {import('express').Request} req Express Request Object
 * @param {import('express').Response} _ Express Response Object
 * @param {import('express').NextFunction} next Express Next Function
 */
export async function authenticate(req, _, next) {
  try {
    // search for authorization value in headers and cookies
    const authorization =
      req.headers.authorization || req.headers.Authorization;

    // access token is required for api access
    if (!authorization) throw new ApiError(403, "auth/no-access-token");

    // authorization will be 'Bearer <access-token>'
    const accessToken = authorization.split(" ")[1];

    // verify access token and get user details
    const {
      name,
      email,
      uid,
      picture: photoURL,
    } = await firebase.auth().verifyIdToken(accessToken);

    // save user details for next middleware/handler
    req.user = {
      name,
      email,
      uid,
      photoURL,
    };
  } catch (error) {
    // save error in request and throw this error in handler
    // error middleware will catch and send appropriate response
    req.error = error;
    console.log(error);
  }

  // move on to next middleware
  next();
}
