import { AutoIncrementPrimaryKey, ForeignKey } from '../decorators';
import { AuditInfo } from './auditInfo.model';
import { MissingRequiredFieldException } from '../exceptions';
export class Inventory extends AuditInfo {
  @AutoIncrementPrimaryKey()
  inventoryId!: number;

  @ForeignKey('Film')
  filmId: number;
  @ForeignKey('Store')
  storeId: number;
  constructor(filmId: number | null, storeId: number | null) {
    super();

    if (filmId === null || typeof filmId !== 'number') {
      throw new MissingRequiredFieldException('filmId');
    }
    if (storeId === null || typeof storeId !== 'number') {
      throw new MissingRequiredFieldException('storeId');
    }

    this.filmId = filmId;
    this.storeId = storeId;
  }
}
