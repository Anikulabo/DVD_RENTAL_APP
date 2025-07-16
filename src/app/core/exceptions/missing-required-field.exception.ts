import { RepositoryException } from './repository.exception';

export class MissingRequiredFieldException extends RepositoryException {
  constructor(fieldName: string) {
    super(`${fieldName} is required but was missing.`);
    this.name = 'MissingRequiredFieldException';
  }
}
