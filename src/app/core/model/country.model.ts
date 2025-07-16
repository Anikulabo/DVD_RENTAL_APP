import { AutoIncrementPrimaryKey } from "../decorators";
import { AuditInfo } from "./auditInfo.model";
import { MissingRequiredFieldException } from "../exceptions";
export class Country extends AuditInfo {
  @AutoIncrementPrimaryKey()
  countryId!: number;

  country: string;

  constructor(country: string) {
    super();

    if (!country || typeof country !== 'string') {
      throw new MissingRequiredFieldException('country');
    }

    this.country = country;
  }
}