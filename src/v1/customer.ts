import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';
import { Authenticator } from '../utils/authenticator';
import { DataStore } from '../utils/dateStore';
export const customerRouter = express.Router();

/**
 * @swagger
 * /v1/customer/filterby/FILTER/sortby/SORT:
 *   get:
 *     summary: Get a filtered and sorted list of customers (all properties of the base object, but without notes)
 *     description:
 *       This endpoint provides a filtered and sorted list of all customers that are in the database
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
customerRouter.get("/filterBy/:filter/sortBy/:sort", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const customerList = await DataStore.getInstance().getCustomersFilteredAndSorted(req.params['filter'], req.params['sort']);
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store: '.concat((err as Error).message))));
	}
});

/**
 * @swagger
 * /v1/customer/sortby/SORT/filterby/FILTER:
 *   get:
 *     summary: Get a sorted and filtered list of customers (all properties of the base object, but without notes)
 *     description:
 *       This endpoint provides a sorted and filtered list of all customers that are in the database
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
customerRouter.get("/sortBy/:sort/filterBy/:filter", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const customerList = await DataStore.getInstance().getCustomersFilteredAndSorted(req.params['filter'], req.params['sort']);
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store '.concat((err as Error).message))));
	}
});

/**
 * @swagger
 * /v1/customer/filterby/FILTER:
 *   get:
 *     summary: Get a filtered list of customers (all properties of the base object, but without notes)
 *     description:
 *       This endpoint provides a filtered list of all customers that are in the database
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
customerRouter.get("/filterBy/:filter", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const customerList = await DataStore.getInstance().getCustomersFilteredAndSorted(req.params['filter'], '*');
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store '.concat((err as Error).message))));
	}
});

/**
 * @swagger
 * /v1/customer/sortby/SORT:
 *   get:
 *     summary: Get a sorted list of customers (all properties of the base object, but without notes)
 *     description:
 *       This endpoint provides a sorted list of all customers that are in the database
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
customerRouter.get("/sortBy/:sort", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const customerList = await DataStore.getInstance().getCustomersFilteredAndSorted('*', req.params['sort']);
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store '.concat((err as Error).message))));
	}
});


/**
 * @swagger
 * /v1/customer/byId/ID:
 *   get:
 *     summary: Get all details of a customer
 *     description:
 *       This endpoint provides all details of a customer, including all notes that are assigned
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
customerRouter.get("/byId/:id", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const customerList = await DataStore.getInstance().getAllCustomerData(req.params['id']);
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store')));
	}
});

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
		const customerList = await DataStore.getInstance().getAllCustomers();
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store')));
	}
});

/**
 * @swagger
 * /v1/customer:
 *   patch:
 *     summary: Update teh status of a customer
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The customers's UUID.
 *                 example: f60d39a4-c1d5-4422-aae6-f54e46e68d56
 *               oldStatus:
 *                 type: string -> "prospective" | "current" | "non-active"
 *                 description: The current status of the customer.
 *                 example: prospective
 *               newStatus:
 *                 type: string -> "prospective" | "current" | "non-active"
 *                 description: The new status of the customer.
 *                 example: current
 *     description:
 *       This endpoint allows updating the status of a customer. It can be "prospective", "current" or "non-active".
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - notes
 */
customerRouter.patch("/", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	console.log(req.body);
	if (!req.body?.customerId || !req.body?.oldStatus || !req.body?.newStatus) {
		next(new HttpError(400, new Error('Can not update note, at least one missing parameter')));
		return;
	}
	try {
		const result = await DataStore.getInstance().updateCustomerStatus(
			req.body.customerId,
			req.body.oldStatus,
			req.body.newStatus
		);
		res.status(200).send(JSON.stringify(result));
	}	catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when updating status of customer: '.concat((err as Error).message))));
	}
});
