import { CustomerStatus } from "../enums/customerStatus";

export interface Customer {
	id: string,
	status: CustomerStatus,
	creation: Date,
	name: string,
	email: string,
	landline: string,
	mobile: string,
	address: string,
	city: string,
	zipCode: string,
	country: string
}