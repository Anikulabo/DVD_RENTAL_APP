import { AuditInfo } from "./auditInfo.model";
import { AutoIncrementPrimaryKey,ForeignKey } from "../decorators";
import { MissingRequiredFieldException } from "../exceptions";
export class Store extends AuditInfo {
  @AutoIncrementPrimaryKey()
  storeId!: number;

  @ForeignKey('Staff')
  managerStaffId: number;

  @ForeignKey('Address')
  addressId: number;

  constructor(managerStaffId: number | null, addressId: number | null) {
    super();

    if (managerStaffId === null || typeof managerStaffId !== 'number') {
      throw new MissingRequiredFieldException('managerStaffId');
    }
    if (addressId === null || typeof addressId !== 'number') {
      throw new MissingRequiredFieldException('addressId');
    }

    this.managerStaffId = managerStaffId;
    this.addressId = addressId;
  }
}
