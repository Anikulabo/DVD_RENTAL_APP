import { BaseUserDTO } from "./baseuserDTO.type";

export interface StaffRegistrationDTO extends BaseUserDTO,AddressDTO{
    email: string; // additional for staff
    staffId?: number; // if you plan on supporting updates
    storeId:number
}
