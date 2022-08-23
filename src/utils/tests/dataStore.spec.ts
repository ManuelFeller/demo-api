import { DataStore } from "../dateStore";

const tonyStarkData = {"id": "0fff8afc-8df4-4161-833c-877240c7b187","status": 2,"creation": 1661269335273,"name": "Tony Stark","email": "ironman@avangers.marvel","landline": "+1555123","mobile": "+1555987","address": "890 Fifth Avenue","city": "New York","zip_code": "10021","country": "Unites States"};
const scroogeMcDuckData = {"id": "3738f9f2-7c4e-44b9-82a3-a6ebe88be3c8","status": 3,"creation": 1661269335283,"name": "Scrooge McDuck","email": "scrooge@moneybin.db","landline": "","mobile": "+999999999","address": "McDuck Manor","city": "Duckburg","zip_code": "Q11940","country": "Disneyland"};
const resultTonyStarkAndMcDuckUnsorted = [tonyStarkData, scroogeMcDuckData];
const resultTonyStarkAndMcDuckSortedAsc = [scroogeMcDuckData, tonyStarkData];
const resultTonyStarkAndMcDuckSortedDesc = [tonyStarkData, scroogeMcDuckData];

describe('status', () => {
	afterAll(() => {
		DataStore.getInstance().closeConnection();
	})
	it('all customers gets all 3 seed customers', async () =>  {
		const customers = await DataStore.getInstance().getAllCustomers();
		expect(customers.length).toEqual(3);
	});
	it('update customer status works as expected', async () => {
		const store = DataStore.getInstance();
		const testCustomer = (await store.getAllCustomers())[0];
		const testId = testCustomer.id;
		const testInitStatus = testCustomer.status;
		// make sure we're running against seed customers
		expect(testId).toBe('f60d39a4-c1d5-4422-aae6-f54e46e68d56');
		expect(testInitStatus).toBe('prospective');
		// actual test
		const testChangedStatus = 'non-active';
		// change to another value
		const update1Result = await store.updateCustomerStatus(testId, testInitStatus, testChangedStatus);
		expect(JSON.stringify(update1Result)).toBe(JSON.stringify({id: testId, status: 'updated'}));
		// change back to original value
		const update2Result = await store.updateCustomerStatus(testId, testChangedStatus, testInitStatus);
		expect(JSON.stringify(update2Result)).toBe(JSON.stringify({id: testId, status: 'updated'}));
		// expect error on invalid current status passed in
		await expect(store.updateCustomerStatus(testId, testChangedStatus, testInitStatus)).rejects.toThrow();
	});
	it('get filtered and sorted customers works as expected', async () => {
		const store = DataStore.getInstance();
		const sortByNameAsc = [{"fieldName": "name","direction": "asc"}];
		const sortByNameDesc = [{"fieldName": "name","direction": "desc"}];
		const filterByNameLike = [
			{"fieldName": "name","value": "Tony%","comparison": "like"},
			{"fieldName": "name","value": "%Duck","comparison": "like","chainType": "or"}
		];
		const filterByExistingId = [{"fieldName": "id","value": "f60d39a4-c1d5-4422-aae6-f54e46e68d56","comparison": "matches"}];
		const filterByExistingIds = [
			{"fieldName": "id","value": "0fff8afc-8df4-4161-833c-877240c7b187","comparison": "matches"},
			{"fieldName": "id","value": "3738f9f2-7c4e-44b9-82a3-a6ebe88be3c8","comparison": "matches","chainType": "or"}
		];
		const filterByNotExistingId = [{"fieldName": "id","value": "invalid-id","comparison": "matches"}];
		// test for search by ID - as we use the dataset that may is used for status update test we do not check the properties
		const filterOnlyResult = await store.getCustomersFilteredAndSorted(filterByExistingId, []);
		expect(filterOnlyResult.length).toBe(1);
		// search by combined like, unsorted
		const filterLikeOnlyResult = await store.getCustomersFilteredAndSorted(filterByNameLike, []);
		expect(JSON.stringify(filterLikeOnlyResult)).toBe(JSON.stringify(resultTonyStarkAndMcDuckUnsorted));
		// search by combined like, sorted ASC
		const filterLikeSortAscResult = await store.getCustomersFilteredAndSorted(filterByNameLike, sortByNameAsc);
		expect(JSON.stringify(filterLikeSortAscResult)).toBe(JSON.stringify(resultTonyStarkAndMcDuckSortedAsc));
		// search by combined like, sorted DESC
		const filterLikeSortDescResult = await store.getCustomersFilteredAndSorted(filterByNameLike, sortByNameDesc);
		expect(JSON.stringify(filterLikeSortDescResult)).toBe(JSON.stringify(resultTonyStarkAndMcDuckSortedDesc));
		// search by id's chained with or, sorted DESC
		const filterByIdsSortDescResult = await store.getCustomersFilteredAndSorted(filterByExistingIds, sortByNameDesc);
		expect(JSON.stringify(filterByIdsSortDescResult)).toBe(JSON.stringify(resultTonyStarkAndMcDuckSortedDesc));
		// filter for non existing id
		const filterNonExistingIdResult = await store.getCustomersFilteredAndSorted(filterByNotExistingId, []);
		expect(filterNonExistingIdResult.length).toBe(0);
	});
	it('returns all data for a specific customer', async () => {
		const fullCustomerData = await DataStore.getInstance().getAllCustomerData('f60d39a4-c1d5-4422-aae6-f54e46e68d56');
		// as the data of the customer may be changed during the test we only check if all required fields were returned
		// (this could be improved with a better test environment, but for now we simply make sure we get back all properties we expect)
		expect((fullCustomerData.id !== undefined)).toBe(true);
		expect((fullCustomerData.status !== undefined)).toBe(true);
		expect((fullCustomerData.creation !== undefined)).toBe(true);
		expect((fullCustomerData.email !== undefined)).toBe(true);
		expect((fullCustomerData.landline !== undefined)).toBe(true);
		expect((fullCustomerData.mobile !== undefined)).toBe(true);
		expect((fullCustomerData.address !== undefined)).toBe(true);
		expect((fullCustomerData.city !== undefined)).toBe(true);
		expect((fullCustomerData.zip_code !== undefined)).toBe(true);
		expect((fullCustomerData.country !== undefined)).toBe(true);
		expect((fullCustomerData.notes !== undefined)).toBe(true);
	});
	it('returns a note by its note id', async () => {
		const noteData = await DataStore.getInstance().getCustomerNoteByID('8048fe15-f207-438d-ad6b-c9283ab11f9a');
		const expectedNote = {"id": "8048fe15-f207-438d-ad6b-c9283ab11f9a","customer": "f60d39a4-c1d5-4422-aae6-f54e46e68d56","content": "The Matrix Cannot Tell You Who You Are."};
		expect(JSON.stringify(noteData)).toBe(JSON.stringify(expectedNote));
	});
	it('returns notes for customer', async () => {
		const customerNotesData = await DataStore.getInstance().getCustomerNotesByCustomerID('f60d39a4-c1d5-4422-aae6-f54e46e68d56');
		const expectedNotes = [{"id": "8048fe15-f207-438d-ad6b-c9283ab11f9a","customer": "f60d39a4-c1d5-4422-aae6-f54e46e68d56","content": "The Matrix Cannot Tell You Who You Are."}];
		expect(JSON.stringify(customerNotesData)).toBe(JSON.stringify(expectedNotes));
	});
	it('note manipulation works as expected', async () => {
		const store = DataStore.getInstance();
		// add a new note
		const createNoteResult = await store.addCustomerNote('0fff8afc-8df4-4161-833c-877240c7b187', 'TestNote');
		expect(createNoteResult.status).toBe('created');
		// update the created note
		const updateNoteResult = await store.updateCustomerNote(createNoteResult.id, '0fff8afc-8df4-4161-833c-877240c7b187', 'TestNote', 'UpdatedNote');
		expect(updateNoteResult.status).toBe('updated');
		// expect error on invalid current content passed in for update
		await expect(store.updateCustomerNote(createNoteResult.id, '0fff8afc-8df4-4161-833c-877240c7b187', 'InvalidOldContent', 'UpdatedNoteContent')).rejects.toThrow();
		// expect error on invalid current content passed in for delete
		await expect(store.deleteCustomerNote(createNoteResult.id, '0fff8afc-8df4-4161-833c-877240c7b187','InvalidContent')).rejects.toThrow();
		// now delete really (clean up)
		const deleteNoteResult = await store.deleteCustomerNote(createNoteResult.id, '0fff8afc-8df4-4161-833c-877240c7b187','UpdatedNote');
		expect(deleteNoteResult.status).toBe('deleted');
	});
});
