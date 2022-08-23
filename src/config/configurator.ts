import * as dotenv from 'dotenv';

/**
 * Singleton that provides the config based on .env or environment variables
 */
export class Configurator {

  /**
   * The internal reference to the instance of itself
   */
  private static _instance: Configurator;


  /**
   * The Port for the server to listen on
   */
  public serverPort: string | undefined;
  /**
   * The List of Origins that are allowed to access the API (needed for CORS)
   */
  public clientOrigins!: string[] ;

  /**
   * Setting to enable the generation and serving of the Swagger / OpenAPI documentation
   */
   public publishSwagger!: boolean;

  /**
   * private constructor to avoid anyone creating additional instances
   */
  private constructor() {
    console.info('Configurator: initializing');
    console.info('Configurator: reading .env / environment variables');
    dotenv.config();
    console.info('Configurator: loading common env variables');

    this.checkForActivatedSwaggerServing();
    this.readCommonSettings();

    console.info('Configurator: checking values');
    let configOk = true;

     // special case origin url's: they are read and checked at teh same time
    if (!this.isReadAndCheckOriginUrlsSuccessful()) {
      configOk = false;
    }
    // check common settings
    if (this.isAnyCommonSettingUndefined()) {
      // error messages are already logged out, just remember there was an issue
      configOk = false;
    }

    if (!configOk) {
      // if anything is not set properly prevent API server from starting
      throw new Error('Configurator Error: environment variables incomplete');
    }
    console.info('Configurator: initialized');
  }

  /**
   * The access point for the class; get your singleton instance here ;-)
   */
  public static get instance(): Configurator
  {
      return this._instance || (this._instance = new this());
  }

  /**
   * Read the common settings that have fixed names and no immediate processing of their content
   */
  private readCommonSettings = () => {
    // "excessive" trimming because some systems require base64 encode of env-vars
    // and may add line-breaks at the end of the env vars / secrets
    this.serverPort = process.env.SERVER_PORT?.trim();
  }

  /**
   * Run the check if the Swagger Documentation should be served
   */
   private checkForActivatedSwaggerServing = () => {
    // you really need to have the right value in the right spelling
    // "excessive" trimming because some systems require base64 encode of env-vars
    // and may add line-breaks at the end of the env vars / secrets
    if (process.env.SWAGGER?.trim() === 'true') {
      this.publishSwagger = true;
      console.warn('Configurator: !!! Swagger Documentation is set to be served / published !!!');
    } else {
      this.publishSwagger = false;
    }
  }


  /**
   * Checks the common settings if any of them is 'undefined' (= missing / not configured)
   *
   * @returns 'true' in case any of the settings is 'undefined', 'false' if not
   */
  private isAnyCommonSettingUndefined = (): boolean => {
    let result = false;
    if (this.serverPort === undefined) {
      console.error('Configurator: SERVER_PORT is undefined');
      result = true;
    }
    return result;
  }

  /**
   * Function to read the origin URLs setting and check if it contains al least one item
   * (no validation of the content, any string would work!)
   *
   * @returns 'true' if there is one or more items, 'false' if not
   */
  private isReadAndCheckOriginUrlsSuccessful = (): boolean => {
    if (process.env.ORIGIN_URLS !== undefined) {
      this.clientOrigins = process.env.ORIGIN_URLS.trim().split(';');
      if (this.clientOrigins.length < 1) {
        console.error('Configurator: ORIGIN_URLS contains no items');
        return false;
      } else {
        console.info('Configurator: ORIGIN_URLS are:');
        console.info(this.clientOrigins);
      }
    } else {
      console.error('Configurator: ORIGIN_URLS is undefined');
      return false;
    }
    return true;
  }

  /**
   * Validator for a string config item (not undefined, not empty string)
   *
   * @param envVarValue The value in the environment variable to validate
   * @param apiName The name of the Config Item (for error log messages)
   * @returns 'undefined' in case of any validation fail or the unaltered value form the environment variable as string
   */
  private validateStringConfigItem = (envVarValue: string | undefined, configItem: string): string | undefined => {
    if (envVarValue === undefined) {
      console.error(`Configurator: ${configItem} is undefined`);
      return undefined;
    } else {
      // additionally check for empty host
      if (envVarValue.trim() === '') {
        console.error(`Configurator: ${configItem} is empty`);
        return undefined;
      }
    }
    return envVarValue;
  }

}
