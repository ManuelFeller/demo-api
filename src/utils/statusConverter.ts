import { CustomerStatus } from "../enums/customerStatus";

/**
 * Helper class to convert the status from string to integer and back
 */
export class StatusConverter {

	/**
	 * Convert status into a string
	 * 
	 * @param status The status as it is saved in the data store
	 * @returns The matching string for the status
	 */
	static convertToString(status: CustomerStatus): string {
		switch (status) {
			case CustomerStatus.prospective:
				return 'prospective';
			case CustomerStatus.current:
				return 'current';
			case CustomerStatus.nonActive:
				return 'non-active';
		}
	}

	/**
	 * Convert status from a string into a numeric value
	 * 
	 * @param status The status as it is passed to the API
	 * @returns The matching number (enum value) for the status
	 */
	static convertToInteger(status: string): number {
		switch (status.trim().toLowerCase()) {
			case 'prospective':
				return CustomerStatus.prospective;
			case 'current':
				return CustomerStatus.current;
			case 'non-active':
				return CustomerStatus.nonActive;
		}
		throw new Error(`Unknown status '${status}' can not be converted`);
	}

}
