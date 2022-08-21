import { UnauthorizedError } from "../errors/unauthorizedError";

/**
 * An Authenticator class.
 * 
 * This can be extended to provide multiple check methods instead of a simple static summy-token.
 * 
 * One example for multiple checks could be having JWT's from an auth-SaaS like Auth0,
 * but if you need to protect extra critical routes directly after a logout you could
 * add on an invalidated check that is called additionally...
 */
export class Authenticator {

	// static token to have basic protection
	// should be extended to a JWT or similar in real life
	static token = '01234567890';

  /**
   * Function to get the token check function to use in a route
   *
   * @returns The function that checks if the submitted token is valid
   */
	 static getTokenCheck = () => {
		return Authenticator.doTokenCheck();
  }

	/**
	 * The function that checks if the submitted token is valid
	 * 
	 * @returns A simple next() result - or the result from the next(new UnauthorizedError) if the token is not valid
	 */
	private static doTokenCheck = () => {
    return async (req: any, res: any, next: any) => {
      res.setHeader('content-type', 'application/json');
      if (!('authorization' in req.headers)) {
        console.error('AUTHORIZATION CHECK: Cannot check token as it was not submitted...');
        return next(new UnauthorizedError('credentials_required', { message: 'Format is Authorization: Bearer [token]' }));
      }
      try {
        // prepare to extract the actual token
        const authHeader = req.headers.authorization.split(' ');
        if (authHeader.length !== 2) {
          console.log('AUTHORIZATION CHECK: Cannot check token as header is not formatted as expected...');
          return next(new UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' }));
        }
				// validate the token - IRL this should be something you obtain during a proper login
				if (
					(authHeader[0] as string).toLowerCase() === 'bearer' &&
					(authHeader[1] as string) === Authenticator.token
				) {
					next();
				} else {
					return next(new UnauthorizedError('invalid_token', { message: 'Token is invalid' }));
				}
      } catch (e) {
        console.log('TOKEN INVALIDATED CHECK: Exception while checking');
        console.error(e);
        return next(new UnauthorizedError('invalid_token', { message: 'Token could not be checked' }));
      }
    };
  }

}