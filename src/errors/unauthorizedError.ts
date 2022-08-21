import { ErrorLike } from "../types/errorLike";
import { HttpError } from "./httpError";



type ErrorCode = 'credentials_bad_scheme' |
  'credentials_bad_format' |
  'credentials_required' |
  'invalid_token' |
  'revoked_token';

export class UnauthorizedError extends HttpError {
  readonly code: string;

  constructor(code: ErrorCode, error: ErrorLike) {
    super(401, error);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.code = code;
    this.name = 'UnauthorizedError';
  }
}