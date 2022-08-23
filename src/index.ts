import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { HttpError } from './errors/httpError';
import { customerRouter } from './v1/customer.router';
import { notesRouter } from './v1/notes.router';
import { Configurator } from './config/configurator';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';

const config = Configurator.instance;

// set up CORS options
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) { // no origin submitted, let it pass
      callback(null, true);
    } else { // origin present, so we check it
      const originIndex = config.clientOrigins.indexOf(origin);
      if (originIndex !== -1) {
        callback(null, config.clientOrigins[originIndex]);
      } else {
        console.error(`CORS: Origin '${origin}' not in the array of whitelisted origins`)
        callback(new Error(`CORS: The used origin not allowed...`));
      }
    }
  }
}

// set up the express app
const app = express();
const v1Router = express.Router();
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/v1", v1Router);
v1Router.use("/customer", customerRouter);
v1Router.use("/notes", notesRouter);

// the root directory
app.get('/', (_req: Request, res: Response) => {
	let apiDocsInfo = '';
	if (config.publishSwagger) {
		apiDocsInfo = `<p>
		  You can access the API documentation at <a href="./api-docs/">this link</a> if you want to explore how it works.<br/>
			The demo access token is <code>01234567890</code>.
		</p>`;
	}
	res.setHeader('content-type', 'text/html');
	res.send(`<!doctype html><html><head><title>Demo API</title><style>body { font-family: sans-serif; }</style></head><body>
	<h1>Demo API</h1>
	<p>This is the API server for the Demo API.</p>
	<p>
	  If a simple <code>200</code> is not enough and you do not want to check HTML content to check the status:<br />
	  you can get	a JSON response for status checking at the <a href="./status/"><code>status</code></a> endpoint.
	</p>
	${apiDocsInfo}
	</body></html>`);
});

// simple status endpoint
app.get('/status', (_req: Request, res: Response) => {
	res.setHeader('content-type', 'application/json');
	res.send(JSON.stringify({status: 'OK'}));
});

// handle undefined routes & errors that occurred / were raised
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err);
	let statusCode = 500;
	if ('status' in err) {
		statusCode = (err as HttpError).status;
	}
	res.setHeader('content-type', 'application/json');
  res.status(statusCode).send(JSON.stringify(
		{
			status: statusCode,
			message: err.message
		}
	));
});

// swagger API documentation
if (config.publishSwagger) {
  const openApiOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Demo API",
        version: "1.0.0",
        description:
          "The API Gateway for the Customer Management Application",
        contact: {
          name: "Manuel Feller",
          url: "https://github.com/ManuelFeller/demo-api",
          email: "github@devsvr.ws",
        },
      },
      servers: [
        {
          url: `http://localhost:${config.serverPort}`,
        },
      ],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'shared secret',
					}
				}
			},
			security: [{
				bearerAuth: []
			}],
    },
    apis: [
      '**/*.router.js'
    ],
  };

  const specs = swaggerJsdoc(openApiOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

// start listening
app.listen(config.serverPort, () => console.log(`API Server: Server listening at port ${config.serverPort}...`))
