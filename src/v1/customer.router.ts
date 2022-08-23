import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';
import { Authenticator } from '../utils/authenticator';
import { DataStore } from '../utils/dateStore';
export const customerRouter = express.Router();

/**
 * @swagger
 * /v1/customer/subset:
 *   post:
 *     summary: Get a filtered and sorted list of customers (all properties of the base object, but without notes)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filterBy:
 *                 type: array
 *                 description: The filter items to be used.
 *                 items:
 *                   $ref: '#/components/schemas/FilterDefinition'
 *               sortBy:
 *                 $ref: '#/components/schemas/SortDefinition'
 *     description:
 *       This endpoint provides a filtered and sorted list of all customers that are in the database
 *     tags:
 *       - customer
 */
customerRouter.post("/subset", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	if (!req.body?.filterBy || !req.body?.sortBy) {
		next(new HttpError(400, new Error('Can not execute request, at least one missing parameter')));
		return;
	}
	try {
		const customerList = await DataStore.getInstance().getCustomersFilteredAndSorted(req.body.filterBy, req.body.sortBy);
		res.status(200).send(JSON.stringify(customerList));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store: '.concat((err as Error).message))));
	}
});



/**
 * @swagger
 * /v1/customer/byId/{id}:
 *   get:
 *     summary: Get all details of a customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the user who's data should be retrieved.
 *         schema:
 *           type: string
 *     description:
 *       This endpoint provides all details of a customer, including all notes that are assigned
 *     responses:
 *       200:
 *         description: A single user including the assigned notes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerWithNotes'
 *       500:
 *         description: Server side error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     tags:
 *       - customer
 */
customerRouter.get("/byId/:id", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const customerData = await DataStore.getInstance().getAllCustomerData(req.params['id']);
		res.status(200).send(JSON.stringify(customerData));	
	} catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when accessing the Data Store')));
	}
});

/**
 * @swagger
 * /v1/customer/all:
 *   get:
 *     summary: Get a list of all customers (all properties of the customer object, but without notes)
 *     description:
 *       This endpoint provides a list of all customers that are in the database
 *     responses:
 *       200:
 *         description: The list of customers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Server side error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     tags:
 *       - customer
 */
customerRouter.get("/all", Authenticator.getTokenCheck(), async (_req: Request, res: Response, next: NextFunction) => {
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
 *     summary: Update the status of a customer
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
 *                 type: string
 *                 description: The current status of the customer. Can be "prospective", "current" or "non-active".
 *                 example: prospective
 *               newStatus:
 *                 type: string
 *                 description: The new status of the customer. Can be "prospective", "current" or "non-active".
 *                 example: current
 *     description:
 *       This endpoint allows updating the status of a customer. It can be "prospective", "current" or "non-active".
 *     responses:
 *       200:
 *         description: An action result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActionResult'
 *       400:
 *         description: Input parameter error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server side error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     tags:
 *       - customer
 */
customerRouter.patch("/", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
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
