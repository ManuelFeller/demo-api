import { CustomerStatus } from "../../enums/customerStatus";
import { StatusConverter } from "../statusConverter";

describe('status', () => {
	it('known status strings get converted to their integer counterparts', async () =>  {
    expect(StatusConverter.convertToInteger('prospective')).toEqual(1);
		expect(StatusConverter.convertToInteger('current')).toEqual(2);
		expect(StatusConverter.convertToInteger('non-active')).toEqual(3);
	});
	it('known status enum values get converted to their string counterparts',async () =>  {
    expect(StatusConverter.convertToString(CustomerStatus.prospective)).toEqual('prospective');
		expect(StatusConverter.convertToString(CustomerStatus.current)).toEqual('current');
		expect(StatusConverter.convertToString(CustomerStatus.nonActive)).toEqual('non-active');
	});
	it('known status integer values get converted to their string counterparts',async () =>  {
    expect(StatusConverter.convertToString(1)).toEqual('prospective');
		expect(StatusConverter.convertToString(2)).toEqual('current');
		expect(StatusConverter.convertToString(3)).toEqual('non-active');
	});
});
