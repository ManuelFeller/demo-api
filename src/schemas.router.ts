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
 *     ActionResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The UUID of the note
 *           example: 5368ec7e-e0a5-4685-b309-3e91e7d657fa
 *         status:
 *           type: string
 *           description: The status of the action. Can be "created", "updated" or "deleted"
 *           example: updated
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The UUID of the customer
 *           example: f60d39a4-c1d5-4422-aae6-f54e46e68d56
 *         status:
 *           type: string
 *           description: The customer status, can be "prospective", "current" or "non-active"
 *           example: current
 *         creation:
 *           type: date
 *           description: The timestamp of the creation of the customer 
 *           example: 1660843695355
 *         name:
 *           type: string
 *           description: The name of the customer
 *           example: Tony Stark
 *         email:
 *           type: string
 *           description: The email of the customer
 *           example: trinity@zion.matrix
 *         landline:
 *           type: string
 *           description: The landline phone number of the customer
 *           example: +13125550690
 *         mobile:
 *           type: string
 *           description: The cellphone number of the customer
 *           example: +1555987
 *         address:
 *           type: string
 *           description: The (street) address of the customer
 *           example: 890 Fifth Avenue
 *         city:
 *           type: string
 *           description: The city of the customer
 *           example: New York
 *         zip_code:
 *           type: The zip code for the address and city of the customer
 *           description: yyy
 *           example: 10021
 *         country:
 *           type: string
 *           description: The country where the customer is located in
 *           example: Unites States
 *     CustomerWithNotes:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The UUID of the customer
 *           example: f60d39a4-c1d5-4422-aae6-f54e46e68d56
 *         status:
 *           type: string
 *           description: The customer status, can be "prospective", "current" or "non-active"
 *           example: current
 *         creation:
 *           type: date
 *           description: The timestamp of the creation of the customer 
 *           example: 1660843695355
 *         name:
 *           type: string
 *           description: The name of the customer
 *           example: Tony Stark
 *         email:
 *           type: string
 *           description: The email of the customer
 *           example: trinity@zion.matrix
 *         landline:
 *           type: string
 *           description: The landline phone number of the customer
 *           example: +13125550690
 *         mobile:
 *           type: string
 *           description: The cellphone number of the customer
 *           example: +1555987
 *         address:
 *           type: string
 *           description: The (street) address of the customer
 *           example: 890 Fifth Avenue
 *         city:
 *           type: string
 *           description: The city of the customer
 *           example: New York
 *         zip_code:
 *           type: The zip code for the address and city of the customer
 *           description: yyy
 *           example: 10021
 *         country:
 *           type: string
 *           description: The country where the customer is located in
 *           example: Unites States
 *         notes:
 *           type: array
 *           description: The notes that are assigned to the user
 *           items:
 *             $ref: '#/components/schemas/Note'
 */

/**

 */