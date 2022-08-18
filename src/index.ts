import express, { Request, Response } from 'express';

const app = express();

app.get('/', (request: Request, response: Response) => {
	response.send('The server is serving...');
})

app.listen(3210, () => console.log('Server listening at 3210...'))
