// /src/app/core/decorators/auto-increment.decorator.ts
export function AutoIncrementPrimaryKey(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const className = target.constructor.name;
    if (!AutoIncrementRegistry[className]) {
      AutoIncrementRegistry[className] = 1;
    } else {
      AutoIncrementRegistry[className]++;
    }

    Object.defineProperty(target, propertyKey, {
      value: AutoIncrementRegistry[className],
      writable: false, // prevent reassignment
      configurable: false,
    });
  };
}

export const AutoIncrementRegistry: { [key: string]: number } = {};
