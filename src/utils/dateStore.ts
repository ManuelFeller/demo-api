import Knex from 'knex';

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

	async getAllCustomers() {
		const result = await this.knex('customers').select();
		return result;
	}

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


	
	
	
}