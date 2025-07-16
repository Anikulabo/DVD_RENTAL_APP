import { AutoIncrementPrimaryKey,ForeignKey } from "../decorators";
import { AuditInfo } from "./auditInfo.model";
import { InvalidDataTypeException,MissingRequiredFieldException } from "../exceptions";
export class Address extends AuditInfo {
  @AutoIncrementPrimaryKey()
  addressId!: number;

  address: string;
  address2?: string;
  district: string;

  @ForeignKey('City')
  cityId: number;

  postalCode?: string;
  phone: string;

  constructor(
    address: string,
    district: string,
    cityId: number | null,
    phone: string,
    address2?: string,
    postalCode?: string
  ) {
    super();

    if (!address || typeof address !== 'string') {
      throw new MissingRequiredFieldException('address');
    }
    if (!district || typeof district !== 'string') {
      throw new MissingRequiredFieldException('district');
    }
    if (cityId === null || typeof cityId !== 'number') {
      throw new MissingRequiredFieldException('cityId');
    }
    if (!phone || typeof phone !== 'string') {
      throw new MissingRequiredFieldException('phone');
    }
    if (address2 !== undefined && typeof address2 !== 'string') {
      throw new InvalidDataTypeException('address2', 'string');
    }
    if (postalCode !== undefined && typeof postalCode !== 'string') {
      throw new InvalidDataTypeException('postalCode', 'string');
    }

    this.address = address;
    this.address2 = address2;
    this.district = district;
    this.cityId = cityId;
    this.postalCode = postalCode;
    this.phone = phone;
  }
}
