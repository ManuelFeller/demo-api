import { ErrorLike } from "../types/errorLike";
import { HttpError } from "./httpError";

/**
 * Type to define the resows that can cause an Unauthorized Error
 */
type ErrorCode = 'credentials_bad_scheme' |
  'credentials_bad_format' |
  'credentials_required' |
  'invalid_token' |
  'revoked_token';

/**
 * Unauthorized Error class
 * 
 * heavily inspired by the one used in jwt-express,
 * but build on top of a self-made HttpError class
 */
export class UnauthorizedError extends HttpError {
  /**
   * The authentication error that occurred
   */
  readonly code: string;

  constructor(code: ErrorCode, error: ErrorLike) {
    super(401, error);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.code = code;
    this.name = 'UnauthorizedError';
  }
}