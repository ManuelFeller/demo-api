import Knex from 'knex';

async function setup() {

	const knex = Knex({
		client: 'better-sqlite3',
		connection: {
			filename: "./data/datastore.sqlite"
		},
		useNullAsDefault: true
	});
	
	
	const hasCustomerTable = await knex.schema.hasTable('customers');
	if (!hasCustomerTable) {
		await knex.schema.createTable('customers', function (table) {
			table.uuid('id', { primaryKey: true }).notNullable().unique();
			table.integer('status').notNullable();
			table.dateTime('creation').notNullable();
			table.string('name', 250).notNullable();
			table.string('email', 320); // 64+@+255
			table.string('landline', 25); // international prefix (00 + 3 digits) + 15 digits number (E.164) + 5 digits buffer for internal phone systems
			table.string('mobile', 20); // international prefix (00 + 3 digits) + 15 digits number (E.164)
			table.string('address', 100); // Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu plus a bit buffer
			table.string('city', 100); // Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu plus a bit buffer
			table.string('zip_code', 10); // should fit according to google (Iran has 10 digits)
			table.string('country', 60) // "The United Kingdom of Great Britain and Northern Ireland" plus buffer
		});
	}
	
	const hasCustomerNotesTable = await knex.schema.hasTable('customer_notes');
	if (!hasCustomerNotesTable) {
		await knex.schema.createTable('customer_notes', function (table) {
			table.uuid('id', { primaryKey: true }).notNullable().unique();
			// ToDo: find out why the constraint prevents inserts into the referenced table
			table.uuid('customer').notNullable()//.references('id').inTable('customers').onDelete('cascade').onUpdate('cascade');
			table.text('content');
		});
	}
	
	await knex('customers').insert([
		{
			id: 'f60d39a4-c1d5-4422-aae6-f54e46e68d56',
			status: 1,
			creation: 1661269335263,
			name: 'Trinity',
			email: 'trinity@zion.matrix',
			landline: '',
			mobile: '+13125550690',
			address: 'Nebuchadnezzar Drive',
			city: 'Zion',
			zip_code: '11001',
			country: 'Earth'
		},
		{
			id: '0fff8afc-8df4-4161-833c-877240c7b187',
			status: 2,
			creation: 1661269335273,
			name: 'Tony Stark',
			email: 'ironman@avangers.marvel',
			landline: '+1555123',
			mobile: '+1555987',
			address: '890 Fifth Avenue',
			city: 'New York',
			zip_code: '10021',
			country: 'Unites States'
		},
		{
			id: '3738f9f2-7c4e-44b9-82a3-a6ebe88be3c8',
			status: 3,
			creation: 1661269335283,
			name: 'Scrooge McDuck',
			email: 'scrooge@moneybin.db',
			landline: '',
			mobile: '+999999999',
			address: 'McDuck Manor',
			city: 'Duckburg',
			zip_code: 'Q11940',
			country: 'Disneyland'
		}
	]);

	await knex('customer_notes').insert(
		{
			id: "8048fe15-f207-438d-ad6b-c9283ab11f9a",
			customer: 'f60d39a4-c1d5-4422-aae6-f54e46e68d56',
			content: "The Matrix Cannot Tell You Who You Are."
		}
	);

	process.exit()
}

setup();