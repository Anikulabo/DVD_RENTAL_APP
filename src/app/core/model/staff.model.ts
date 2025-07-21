import { AutoIncrementPrimaryKey } from "../decorators";
import { MissingRequiredFieldException } from "../exceptions";
import { User } from "./user.model";
export class Staff extends User {
    @AutoIncrementPrimaryKey()
    staffId!: number;

    email: string;

    constructor(
        firstName: string,
        lastName: string,
        userId: number | null,
        addressId: number,
        storeId: number,
        email: string
    ) {
        super(firstName, lastName, addressId, userId, storeId);
        
        if (!email || typeof email !== 'string') {
            throw new MissingRequiredFieldException('email');
        }

        this.email = email;
    }
}
