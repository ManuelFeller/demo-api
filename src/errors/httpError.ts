import { ErrorLike } from "../types/errorLike";

export class HttpError extends Error {
  readonly status: number;
  readonly inner: ErrorLike;

  constructor(status: number, error: ErrorLike) {
    super(error.message);
    Object.setPrototypeOf(this, HttpError.prototype);
    this.status = status;
    this.name = 'HttpError';
    this.inner = error;
  }
}