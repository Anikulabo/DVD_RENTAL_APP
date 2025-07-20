import { AutoIncrementPrimaryKey } from "../decorators/autoIncrement.decorator";
import { User } from "./user.model";
export class Customer extends User {
    @AutoIncrementPrimaryKey()
    customerId!: number;

    constructor(
        firstName: string,
        lastName: string,
        addressId: number,
        userId:number | null,
        storeId: number,
    ) {
        super(firstName, lastName, addressId,userId, storeId);
    }
}
