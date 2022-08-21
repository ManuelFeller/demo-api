import Knex from 'knex';
import crypto from 'crypto';
import { resourceLimits } from 'worker_threads';
import { StatusConverter } from './statusConverter';

export class DataStore {

	private static instance: DataStore;

	private knex;

	private constructor() {
		this.knex = Knex({
			client: 'better-sqlite3',
			connection: {
				filename: "./data/datastore.sqlite"
			},
			useNullAsDefault: true
		});
	}

	public static getInstance(): DataStore {
		if (!DataStore.instance) {
			DataStore.instance = new DataStore();
		}
		return DataStore.instance;
}

	/* ====== Section for getting all customers ====== */

	async getAllCustomers() {
		const result = await this.knex('customers').select();
		result.forEach((customer) => {
			customer.status = StatusConverter.convertToString(customer.status);
		});
		return result;
	}

	/* ====== Section for setting the customers status ====== */

	async updateCustomerStatus(customerId: string, oldStatus: string, newStatus: string) {
		const result = await this.knex('customers').update({
			status: StatusConverter.convertToInteger(newStatus)
		}).where({
			id: customerId,
			status: StatusConverter.convertToInteger(oldStatus)
		});
		if (result === 1) {
			return {id: customerId, status: 'updated'};
		} else {
			throw new Error(`Status of customer with ID ${customerId} could not be updated, it may have been updated by another user already`);
		}
	}


	/* ====== Section for getting the customers filtered / sorted ====== */

	async getCustomersFilteredAndSorted(filterBy: string, sortBy: string) {
		// sort=> fieldname:ASC or field:DESC
		// filter, exact (AND) => fieldname:value
		// filter, exact (AND or OR) => AND|OR:fieldname:value
		// filter, like => fieldname~value
		
		let filters: string[] = [];
		if (filterBy.trim() !== '*') {
			filters = filterBy.split(',')
		}


		const result = await this.knex('customers').select().where((builder) => {
			const counters = {
				where: 0,
				whereLike: 0
			};
			for (let filter of filters) {
				this.addWhereCondition(builder, filter, counters);
			}
		});
		return result;

	}

	private addWhereCondition(builder: any, filter: string, counters: {where: number, whereLike: number}) {
		// exact match (only if we have at least on char before and after the split character)
		if (filter.indexOf(':') > 0 && filter.indexOf(':') < filter.length -1) {
			const tempCondition = filter.split(':');
			if (tempCondition.length === 3) {
				// AND / OR included
			} else {
				// no filter type, assuming OR
			}
			//builder.where()
		}
		// like match (only if we have at least on char before and after the split character)
		else if (filter.indexOf('~') > 0 && filter.indexOf('~') < filter.length -1) {
			const tempCondition = filter.split('~');
			//
		} else {
			// invalid term, throw error
			throw new Error(`The term ${filter} is not a valid filter expression`)
		}
	}

	// filter for AND and OR and multiple values

	/* ====== Section for the customer and all notes functionality ====== */

	/**
	 * Function to load a customer including all assigned notes
	 * 
	 * @param customerId The ID of the customer that should be loaded
	 * @returns The customer object with an additional notes array (that may be empty)
	 */
	async getAllCustomerData(customerId: string) {
		const customerDetails = await this.knex('customers').select().where({
			id: customerId
		});
		if (customerDetails.length === 1) {
			const customerNotes = await this.knex('customer_notes').select().where({
				customer: customerId
			});
			customerDetails[0].status = StatusConverter.convertToString(customerDetails[0].status);
			return { ...customerDetails[0], notes: customerNotes}
		} else {
			throw new Error(`Customer with ID ${customerId} does not exist`);
		}
	}

	/* ====== Section for the notes functionality ====== */

	/**
	 * Function to load a specific note
	 * 
	 * @param noteId The ID of the note that should be loaded
	 * @returns The note that was loaded from the data store
	 */
	async getCustomerNoteByID(noteId: string) {
		const result = await this.knex('customer_notes').select().where({
			id: noteId
		});
		if (result.length <= 1) {
			return result;
		} else {
			throw new Error(`More then one note matches ID, something went seriously wrong`);
		}
	}

	/**
	 * Function to load a all notes that belong to a customer
	 * 
	 * @param customerId The ID of the customer of which all notes should be loaded
	 * @returns The notes that were loaded from the data store
	 */
	 async getCustomerNotesByCustomerID(customerId: string) {
		const result = await this.knex('customer_notes').select().where({
			customer: customerId
		});
		return result;
	}

	/**
	 * Function to add a note to a customer
	 * 
	 * @param customerId The ID of the customer where the note belongs to
	 * @param noteContent The content of the note
	 * @returns {id: NEW_NOTE_ID, status: 'created'} in case of success
	 */
	async addCustomerNote(customerId: string, noteContent: string) {
		// as there were issues with knex/SQLite when having a foreign key we need to validate the customer ID exists
		const customerCheck = await this.knex('customers').select().where({id: customerId});
		if (customerCheck.length === 1) {
			const noteUUID = crypto.randomUUID();
			const result = await this.knex('customer_notes').insert({
				id: noteUUID,
				customer: customerId,
				content: noteContent
			});
			if (result.length === 1) {
				return {id: noteUUID, status: 'created'};
			} else {
				throw new Error(`Note could not be created`);
			}
		} else {
			throw new Error(`Customer with ID ${customerId} does not exist`);
		}
	}
	
	/**
	 * Function to update a note
	 * 
	 * @param noteId The ID of the note that should be updated
	 * @param customerId The ID of the customer where the note belongs to (to make sure the note was not re-assigned and the customer still exists)
	 * @param oldNoteContent The old note content (to check if there were any changes by another user)
	 * @param newNoteContent The new content of the note that should be saved
	 * @returns {id: noteId, status: 'updated'} in case of success
	 */
	async updateCustomerNote(noteId: string, customerId: string, oldNoteContent: string, newNoteContent: string) {
		// as there were issues with knex/SQLite when having a foreign key we need to validate the customer ID still exists
		const customerCheck = await this.knex('customers').select().where({id: customerId});
		if (customerCheck.length === 1) {
			const result = await this.knex('customer_notes').update({
				content: newNoteContent
			}).where({
				id: noteId,
				customer: customerId,
				content: oldNoteContent
			});
			if (result === 1) {
				return {id: noteId, status: 'updated'};
			} else {
				throw new Error(`Note with ID ${noteId} could not be updated, it may have been updated by another user already`);
			}
		} else {
			throw new Error(`Customer with ID ${customerId} does not exist, note update not possible`);
		}
	}
	
	/**
	 * Function to delete a note
	 * 
	 * @param noteId The ID of the note that should be deleted
	 * @param customerId The ID of the customer where the note belongs to (to make sure the note was not re-assigned)
	 * @param noteContent The old note content (to check if there were any changes by another user)
	 * @returns {id: noteId, status: 'deleted'} in case of success
	 */
	async deleteCustomerNote(noteId: string, customerId: string, noteContent: string) {
		const result = await this.knex('customer_notes').delete().where({
			id: noteId,
			customer: customerId,
			content: noteContent
		});
		if (result === 1) {
			return {id: noteId, status: 'deleted'};
		} else {
			throw new Error(`Note with ID ${noteId} could not be deleted, it may have been updated or deleted by another user`);
		}
	}
	
}