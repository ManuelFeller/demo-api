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
	
}