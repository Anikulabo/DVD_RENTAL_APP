import { AuditInfo } from './auditInfo.model';
import { MissingRequiredFieldException } from '../exceptions/missing-required-field.exception';
import { AutoIncrementPrimaryKey } from '../decorators/autoIncrement.decorator';
export class Category extends AuditInfo {
  @AutoIncrementPrimaryKey()
    categoryId!: number;
  name: string;
  constructor( name: string = '') {
    super();
    if (!name || typeof name !== 'string') {
      throw new MissingRequiredFieldException('name');
    }
    this.name = name;
  }
}
