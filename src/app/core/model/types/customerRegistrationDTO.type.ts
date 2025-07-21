import { BaseUserDTO } from "./baseuserDTO.type";

export interface CustomerRegistrationDTO extends AddressDTO,BaseUserDTO{
    customerId?: number;
}