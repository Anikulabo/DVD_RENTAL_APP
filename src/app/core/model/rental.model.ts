import { AuditInfo } from "./auditInfo.model";
import { AutoIncrementPrimaryKey,ForeignKey } from "../decorators";
import { InvalidDataTypeException,MissingRequiredFieldException } from "../exceptions";
export class Rental extends AuditInfo {
  @AutoIncrementPrimaryKey()
  rentalId!: number;

  rentalDate: Date;

  @ForeignKey('Inventory')
  inventoryId: number;

  @ForeignKey('Customer')
  customerId: number;

  returnDate?: Date;

  @ForeignKey('Staff')
  staffId: number;

  constructor(
    rentalDate: Date,
    inventoryId: number | null,
    customerId: number | null,
    staffId: number | null,
    returnDate?: Date
  ) {
    super();

    if (!(rentalDate instanceof Date)) {
      throw new InvalidDataTypeException('rentalDate', 'Date');
    }
    if (inventoryId === null || typeof inventoryId !== 'number') {
      throw new MissingRequiredFieldException('inventoryId');
    }
    if (customerId === null || typeof customerId !== 'number') {
      throw new MissingRequiredFieldException('customerId');
    }
    if (staffId === null || typeof staffId !== 'number') {
      throw new MissingRequiredFieldException('staffId');
    }
    if (returnDate !== undefined && !(returnDate instanceof Date)) {
      throw new InvalidDataTypeException('returnDate', 'Date');
    }

    this.rentalDate = rentalDate;
    this.inventoryId = inventoryId;
    this.customerId = customerId;
    this.staffId = staffId;
    this.returnDate = returnDate;
  }
}