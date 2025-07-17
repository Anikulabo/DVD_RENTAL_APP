import { AuditInfo } from "./auditInfo.model";
import { AutoIncrementPrimaryKey,ForeignKey } from "../decorators";
import { MissingRequiredFieldException,InvalidDataTypeException } from "../exceptions";
export class Payment extends AuditInfo {
  @AutoIncrementPrimaryKey()
  paymentId!: number;

  @ForeignKey('Customer')
  customerId: number;

  @ForeignKey('Staff')
  staffId: number;

  @ForeignKey('Rental')
  rentalId: number;

  amount: number;
  paymentDate: Date;

  constructor(
    customerId: number | null,
    staffId: number | null,
    rentalId: number | null,
    amount: number,
    paymentDate: Date
  ) {
    super();
    if (customerId === null || typeof customerId !== 'number') {
      throw new MissingRequiredFieldException('customerId');
    }
    if (staffId === null || typeof staffId !== 'number') {
      throw new MissingRequiredFieldException('staffId');
    }
    if (rentalId === null || typeof rentalId !== 'number') {
      throw new MissingRequiredFieldException('rentalId');
    }
    if (typeof amount !== 'number') {
      throw new InvalidDataTypeException('amount', 'number');
    }
    if (!(paymentDate instanceof Date)) {
      throw new InvalidDataTypeException('paymentDate', 'Date');
    }

    this.customerId = customerId;
    this.staffId = staffId;
    this.rentalId = rentalId;
    this.amount = amount;
    this.paymentDate = paymentDate;
  }
}