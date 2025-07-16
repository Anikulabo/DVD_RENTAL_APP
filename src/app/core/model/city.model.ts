import { AutoIncrementPrimaryKey,ForeignKey } from "../decorators";
import { MissingRequiredFieldException } from "../exceptions";
import { AuditInfo } from "./auditInfo.model";
export class City extends AuditInfo {
  @AutoIncrementPrimaryKey()
  cityId!: number;

  city: string;

  @ForeignKey('Country')
  countryId: number;

  constructor(city: string, countryId: number | null) {
    super();

    if (!city || typeof city !== 'string') {
      throw new MissingRequiredFieldException('city');
    }
    if (countryId === null || typeof countryId !== 'number') {
      throw new MissingRequiredFieldException('countryId');
    }

    this.city = city;
    this.countryId = countryId;
  }
}