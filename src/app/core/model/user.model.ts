import { ForeignKey } from "../decorators";
import { InvalidDataTypeException, MissingRequiredFieldException } from "../exceptions";
import { AuditInfo } from "./auditInfo.model";
export abstract class User extends AuditInfo {
    firstName: string;
    lastName: string;
    active: boolean;

    @ForeignKey('Address')
    addressId: number;

    @ForeignKey('Store')
    storeId: number;

    @ForeignKey('UserRecord')
    userId: number | null; // ✅ Make nullable here

    constructor(
        firstName: string,
        lastName: string,
        addressId: number,
        userId: number | null,
        storeId: number,
        active: boolean = true
    ) {
        super();

        if (!firstName || typeof firstName !== 'string') {
            throw new MissingRequiredFieldException('firstName');
        }
        if (!lastName || typeof lastName !== 'string') {
            throw new MissingRequiredFieldException('lastName');
        }
        if (addressId === null || typeof addressId !== 'number') {
            throw new MissingRequiredFieldException('addressId');
        }
        if (storeId === null || typeof storeId !== 'number') {
            throw new MissingRequiredFieldException('storeId');
        }
        if (typeof active !== 'boolean') {
            throw new InvalidDataTypeException('active', 'boolean');
        }

        this.firstName = firstName;
        this.lastName = lastName;
        this.addressId = addressId;
        this.storeId = storeId;
        this.userId = userId;  // ✅ Can now be null
        this.active = active;
    }
}
