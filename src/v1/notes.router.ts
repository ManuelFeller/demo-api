import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';
import { Authenticator } from '../utils/authenticator';
import { DataStore } from '../utils/dateStore';
export const notesRouter = express.Router();

/**
 * @swagger
 * /v1/notes/byId/ID:
 *   get:
 *     summary: Get a specific note by it's ID
 *     description:
 *       This endpoint provides the content of one specific note
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
notesRouter.get("/byId/:id", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	try {
		const result = await DataStore.getInstance().getCustomerNoteByID(req.params['id']);
		res.status(200).send(JSON.stringify(result[0]));
	}	catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when fetching the note: '.concat((err as Error).message))));
	}
});

/**
 * @swagger
* /v1/notes/byCustomer/ID:
 *   get:
 *     summary: Get a list of all notes that belong to a customer
 *     description:
 *       This endpoint provides a list of all notes that belong to a customer
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - customer
 */
notesRouter.get("/byCustomer/:id", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await DataStore.getInstance().getCustomerNotesByCustomerID(req.params['id']);
		res.status(200).send(JSON.stringify(result));
	}	catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when fetching the customers note: '.concat((err as Error).message))));
	}
});

/**
 * @swagger
 * /v1/notes:
 *   put:
 *     summary: Save a note for a customer
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
 *               noteContent:
 *                 type: string
 *                 description: The content for the note.
 *                 example: This is an example note
 *     description:
 *       This endpoint allows adding a note for a customer. The customer still needs to exist.
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - notes
 */
notesRouter.put("/", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	if (!req.body?.customerId || !req.body?.noteContent) {
		next(new HttpError(400, new Error('Can not add note, at least one missing parameter')));
		return;
	}
	try {
		const result = await DataStore.getInstance().addCustomerNote(req.body.customerId, req.body.noteContent);
		res.status(200).send(JSON.stringify(result));
	}	catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when saving the note: '.concat((err as Error).message))));
	}
});

/**
 * @swagger
 * /v1/notes:
 *   patch:
 *     summary: Update a note that belongs to a customer
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noteId:
 *                 type: string
 *                 description: The notes's UUID.
 *                 example: ba6d358b-b113-4445-8719-7c5f9d55429c
 *               customerId:
 *                 type: string
 *                 description: The customers's UUID.
 *                 example: f60d39a4-c1d5-4422-aae6-f54e46e68d56
 *               oldNoteContent:
 *                 type: string
 *                 description: The current content of the note.
 *                 example: This is an example note
 *               newNoteContent:
 *                 type: string
 *                 description: The new content of the note.
 *                 example: This is updated content for the example note
 *     description:
 *       This endpoint allows updating a note for a customer. The customer still needs to exist,
 *       and the note must not have changed since it was loaded / requested by the client application
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - notes
 */
notesRouter.patch("/", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	console.log(req.body);
	if (!req.body?.noteId || !req.body?.customerId || !req.body?.oldNoteContent || !req.body?.newNoteContent) {
		next(new HttpError(400, new Error('Can not update note, at least one missing parameter')));
		return;
	}
	try {
		const result = await DataStore.getInstance().updateCustomerNote(
			req.body.noteId,
			req.body.customerId,
			req.body.oldNoteContent,
			req.body.newNoteContent
		);
		res.status(200).send(JSON.stringify(result));
	}	catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when updating the note: '.concat((err as Error).message))));
	}
});

/**
 * @swagger
 * /v1/notes:
 *   delete:
 *     summary: Delete a note that belongs to a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noteId:
 *                 type: string
 *                 description: The notes's UUID.
 *                 example: ba6d358b-b113-4445-8719-7c5f9d55429c
 *               customerId:
 *                 type: string
 *                 description: The customers's UUID.
 *                 example: f60d39a4-c1d5-4422-aae6-f54e46e68d56
 *               noteContent:
 *                 type: string
 *                 description: The current content of the note.
 *                 example: This is updated content for the example note
 *     description:
 *       This endpoint allows deleting a note for a customer. The note must not have changed since
 *       it was loaded / requested by the client application; the customer does not need to exist any more
 *       <strong>Token as Authorization Bearer required</strong>
 *     tags:
 *       - notes
 */
notesRouter.delete("/", Authenticator.getTokenCheck(), async (req: Request, res: Response, next: NextFunction) => {
	res.setHeader('content-type', 'application/json');
	console.log(req.body);
	if (!req.body?.noteId || !req.body?.customerId || !req.body?.noteContent) {
		next(new HttpError(400, new Error('Can not delete note, at least one missing parameter')));
		return;
	}
	try {
		const result = await DataStore.getInstance().deleteCustomerNote(
			req.body.noteId,
			req.body.customerId,
			req.body.noteContent
		);
		res.status(200).send(JSON.stringify(result));
	}	catch (err) {
		console.log(err);
		next(new HttpError(500, new Error('Error when updating the note: '.concat((err as Error).message))));
	}
});