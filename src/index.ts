import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { HttpError } from './errors/httpError';
import { customerRouter } from './v1/customer.router';
import { notesRouter } from './v1/notes.router';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const SERVER_PORT = 3210;
const PUBLISH_SWAGGER = true;


const app = express();
const v1Router = express.Router();

app.use(bodyParser.json());

app.use("/v1", v1Router);
v1Router.use("/customer", customerRouter);
v1Router.use("/notes", notesRouter);



app.get('/', (req: Request, res: Response) => {
	res.send('The server is serving...');
});

app.get('/test/:filter', (request: Request, res: Response) => {
	res.setHeader('content-type', 'application/json');
	res.send(JSON.stringify(request.params));
});

// handle undefined routes & errors that occurred / were raised
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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

if (PUBLISH_SWAGGER) {
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
          url: `http://localhost:${SERVER_PORT}`,
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

app.listen(3210, () => console.log(`Server listening at ${SERVER_PORT}...`))
