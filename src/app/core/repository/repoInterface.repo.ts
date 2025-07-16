export abstract class MockCrud<T> {
  abstract getAll(): T[];
  abstract findById(id: number): T | null;
  abstract findByDescription(description: string): T[] ;
  abstract add(item: T): void;
  abstract update(id: number, item: Partial<T>): void;
  abstract delete(id: number): void;
}
