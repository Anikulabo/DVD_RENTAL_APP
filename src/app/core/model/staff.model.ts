import { AuditInfo } from "./auditInfo.model";
import { AutoIncrementPrimaryKey,ForeignKey } from "../decorators";
import { MissingRequiredFieldException,InvalidDataTypeException } from "../exceptions";
export class Staff extends AuditInfo {
  @AutoIncrementPrimaryKey()
  staffId!: number;

  firstName: string;
  lastName: string;

  @ForeignKey('Address')
  addressId: number;

  @ForeignKey('Store')
  storeId: number;

  active: boolean;
  username: string;

  constructor(
    firstName: string,
    lastName: string,
    addressId: number | null,
    storeId: number | null,
    active: boolean = true,
    username: string
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
    if (!username || typeof username !== 'string') {
      throw new MissingRequiredFieldException('username');
    }
    if (typeof active !== 'boolean') {
      throw new InvalidDataTypeException('active', 'boolean');
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.addressId = addressId;
    this.storeId = storeId;
    this.active = active;
    this.username = username;
  }
}