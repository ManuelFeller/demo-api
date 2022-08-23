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
const app = express();
const v1Router = express.Router();

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

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/v1", v1Router);
v1Router.use("/customer", customerRouter);
v1Router.use("/notes", notesRouter);

app.get('/', (_req: Request, res: Response) => {
	res.send('The server is serving...');
});

app.get('/test/:filter', (request: Request, res: Response) => {
	res.setHeader('content-type', 'application/json');
	res.send(JSON.stringify(request.params));
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
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );
}

// start listening

app.listen(config.serverPort, () => console.log(`API Server: Server listening at port ${config.serverPort}...`))
