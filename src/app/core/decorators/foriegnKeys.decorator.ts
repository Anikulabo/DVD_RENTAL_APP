import { AutoIncrementRegistry } from './autoIncrement.decorator';
import { InvalidDataTypeException } from '../exceptions/invalidDatatype.exception';
export function ForeignKey(targetClassName: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const privateKey = `__${String(propertyKey)}`;
    
    Object.defineProperty(target, propertyKey, {
      set(value: number) {
        const maxId = AutoIncrementRegistry[targetClassName] || 0;
        if (typeof value !== 'number' || value > maxId || value < 1) {
          throw new InvalidDataTypeException(
            String(propertyKey),
            `valid ${targetClassName} ID between 1 and ${maxId}`
          );
        }
        Object.defineProperty(this, privateKey, {
          value,
          writable: true,
          enumerable: false,
          configurable: true,
        });
      },
      get() {
        return this[privateKey];
      },
      enumerable: true,
      configurable: true,
    });
  };
}