import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from './errors/httpError';
import { UnauthorizedError } from './errors/unauthorizedError';
import { customerRouter } from './v1/customer';
import { notesRouter } from './v1/notes';





const app = express();
const v1Router = express.Router();

app.use("/v1", v1Router);
v1Router.use("/customer", customerRouter);
v1Router.use("/notes", notesRouter);



app.get('/', (request: Request, response: Response) => {
	response.send('The server is serving...');
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


app.listen(3210, () => console.log('Server listening at 3210...'))
