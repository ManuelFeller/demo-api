import { ErrorLike } from "../types/errorLike";

/**
 * Basic HTTP-Error class for the API server
 */
export class HttpError extends Error {
  /**
   * HTTP Status Code
   */
  readonly status: number;
  /**
   * The inner error
   */
  readonly inner: ErrorLike;

  constructor(status: number, error: ErrorLike) {
    super(error.message);
    Object.setPrototypeOf(this, HttpError.prototype);
    this.status = status;
    this.name = 'HttpError';
    this.inner = error;
  }
}