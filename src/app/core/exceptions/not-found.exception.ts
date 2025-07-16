import { RepositoryException } from './repository.exception';

export class NotFoundException extends RepositoryException {
  constructor(entityName: string, id: number | string) {
    super(`${entityName} with ID ${id} was not found.`);
    this.name = 'NotFoundException';
  }
}
