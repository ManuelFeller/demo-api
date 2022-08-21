// this is an empty file describing the router's schemas for swagger / open-api in a central location

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: The http status code. Simple repetition of the status code in the response.
 *           example: 500
 *         message:
 *           type: string
 *           description: Description of the error.
 *           example: Something went wrong...
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The UUID of the note
 *           example: 5368ec7e-e0a5-4685-b309-3e91e7d657fa
 *         customer:
 *           type: string
 *           description: The UUID of the customer that the note belongs to.
 *           example: f60d39a4-c1d5-4422-aae6-f54e46e68d56
 *         content:
 *           type: string
 *           description: The content of the note.
 *           example: Some example note content...
 *     NoteActionResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The UUID of the note
 *           example: 5368ec7e-e0a5-4685-b309-3e91e7d657fa
 *         status:
 *           type: string => "created", "updated" or "deleted"
 *           description: The status of the action.
 *           example: updated
 */