import { CustomerStatus } from "../enums/customerStatus";
import { CustomerNote } from "./customerNote";

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
	zip_ode: string,
	country: string,
	notes?: CustomerNote[]
}