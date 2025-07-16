import { AuditInfo } from "./auditInfo.model";
import { InvalidDataTypeException } from "../exceptions/invalidDatatype.exception";
import { MissingRequiredFieldException } from "../exceptions/missing-required-field.exception";
import { AutoIncrementPrimaryKey } from "../decorators/autoIncrement.decorator";
import { ForeignKey } from "../decorators/foriegnKeys.decorator";
export class Customer extends AuditInfo{
 @AutoIncrementPrimaryKey()
  customerId!: number;
 @ForeignKey("Store") 
  storeId: number;
  firstName: string;
  lastName: string;
  @ForeignKey("Address") 
  addressId: number;
  active: boolean;
 constructor(
    storeId: number | null,
    firstName: string="",
    lastName: string="",
    addressId: number | null,
    active: boolean=false
  )
  {
    super();  
    if (storeId === null || typeof storeId !== 'number') {
      throw new MissingRequiredFieldException('storeId');
    }

    if (addressId === null || typeof addressId !== 'number') {
      throw new MissingRequiredFieldException('addressId');
    }

    if (typeof firstName !== 'string') {
      throw new InvalidDataTypeException('firstName', 'string');
    }

    if (typeof lastName !== 'string') {
      throw new InvalidDataTypeException('lastName', 'string');
    }

    if (typeof active !== 'boolean') {
      throw new InvalidDataTypeException('active', 'boolean');
    }

    this.storeId = storeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.addressId = addressId;
    this.active = active;
  }
}