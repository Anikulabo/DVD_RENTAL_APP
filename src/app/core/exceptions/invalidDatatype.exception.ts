import { RepositoryException } from './repository.exception';

export class InvalidDataTypeException extends RepositoryException {
  constructor(fieldName: string, expectedType: string) {
    super(`${fieldName} must be of type ${expectedType}.`);
    this.name = 'InvalidDataTypeException';
  }
}
