import Knex from 'knex';
import crypto from 'crypto';
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

	async getCustomersFilteredAndSorted(filterBy: any[], sortBy: any) {
		const convertedSortCriteria = this.checkAndConvertSortObjects(sortBy);
		// ToDo: test if no filters still work
		const result = await this.knex('customers').select().where((builder) => {
			let isFirstClause = true;
			for (let filter of filterBy) {
				// check for errors in the filter object; will exit with error in case it is not valid
				this.checkIfFilterObjectIsValid(filter, isFirstClause);
				// add the filter to the query
				this.addWhereCondition(builder, filter, isFirstClause);
				isFirstClause = false;
			}
		}).orderBy(convertedSortCriteria);
		return result;

	}

	private addWhereCondition(builder: any, filter: any, isFirstClause: boolean) {
		if (isFirstClause) {
			// first clause
			switch (filter.comparison) {
				case 'matches':
					builder.where(filter.fieldName, filter.value);
					break;
				case 'like':
					builder.whereLike(filter.fieldName, filter.value);
					break;
				case 'greater':
					builder.where(filter.fieldName, '>', filter.value);
					break;
				case 'smaller':
					builder.where(filter.fieldName, '<', filter.value);
					break;
			}
		} else {
			// following clauses (can be 'or' or 'and')
			if (filter.chainType === 'and') {
				switch (filter.comparison) {
					case 'matches':
						builder.andWhere(filter.fieldName, filter.value);
						break;
					case 'like':
						builder.andWhereLike(filter.fieldName, filter.value);
						break;
					case 'greater':
						builder.andWhere(filter.fieldName, '>', filter.value);
						break;
					case 'smaller':
						builder.andWhere(filter.fieldName, '<', filter.value);
						break;
				}
			} else {
				// due to the check we already performed it can only be 'or'
				switch (filter.comparison) {
					case 'matches':
						builder.orWhere(filter.fieldName, filter.value);
						break;
					case 'like':
						builder.orWhereLike(filter.fieldName, filter.value);
						break;
					case 'greater':
						builder.orWhere(filter.fieldName, '>', filter.value);
						break;
					case 'smaller':
						builder.orWhere(filter.fieldName, '<', filter.value);
						break;
				}
			}
		}
	}

	private checkIfFilterObjectIsValid(filter: any, ignoreChainType: boolean = false) {
		// check if all properties are set
		if (
			filter.value === undefined ||
			filter.fieldName === undefined ||
			filter.comparison === undefined ||
			filter.chainType === undefined
		) {
			throw new Error(`Filter object misses at least one property`);
		}
		// check comparison type
		if (
			filter.comparison !== 'matches' &&
			filter.comparison !== 'like' &&
			filter.comparison !== 'greater' &&
			filter.comparison !== 'smaller'
		) {
			throw new Error(`Filter comparison type is unknown`);
		}
		// check chaining (if not marked as ignored - for the first condition)
		if (
			filter.chainType !== 'and' &&
			filter.chainType !== 'or' &&
			!ignoreChainType
		) {
			throw new Error(`Filter chainType value is unknown`);
		}
	}

	private checkAndConvertSortObjects(sortBy: any[]) {
		const result: {column: string, order: 'asc' | 'desc'}[] = [];
		sortBy.forEach((sortItem) => {
			if (sortItem.fieldName === undefined || sortItem.direction === undefined) {
				throw new Error(`Sort object misses at least one property`);
			}
			if (sortItem.direction === 'asc') {
				result.push({ column: sortItem.fieldName, order: 'asc'});
			} else if (sortItem.direction === 'desc') {
				result.push({ column: sortItem.fieldName, order: 'desc'});
			} else {
				throw new Error(`Sort object has invalid sorting direction`);
			}
		})
		return result;
	}

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