import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';
import { Authenticator } from '../utils/authenticator';
import { DataStore } from '../utils/dateStore';
export const customerRouter = express.Router();


/**
 * @swagger
 * /v1/customer/all:
 *   get:
 *     summary: Get a list of all customers (all properties of the base object, but without notes)
 *     description:
 *       This endpoint provides a list of all customers that are in the database
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
customerRouter.get("/all", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const customerList = await DataStore.getInstance().getAllCustomers()
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store')));
	}
}
);