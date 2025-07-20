import { AutoIncrementPrimaryKey,ForeignKey } from "../decorators";
import { User } from "./user.model";
export class Staff extends User {
    @AutoIncrementPrimaryKey()
    staffId!: number;
    constructor(
        firstName: string,
        lastName: string,
        userId:number | null,
        addressId: number,
        storeId: number,

    ) {
        super(firstName, lastName, addressId,userId, storeId);
    }
}
