/**
 *
 * @param {(request: import('express').Request, response: import('express').Response, next: import('express').NextFunction) => void} handler Express Request Handler
 * @returns {(request: import('express').Request, response: import('express').Response, next: import('express').NextFunction) => void}
 */
export const wrapper = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);
