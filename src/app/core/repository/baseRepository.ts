import { MockCrud } from "./repoInterface.repo";
export abstract class BaseRepository<T extends { [key: string]: any }>
  implements MockCrud<T>
{
  protected _items: T[] = [];
  protected abstract idKey: string;

  getAll(): T[] {
    return this._items;
  }

  findById(id: number): T | null {
    return this._items.find((item) => item[this.idKey] === id) ?? null;
  }

  findByDescription(description: string): T[] {
    return this._items.filter((item) =>
      Object.values(item).some(
        (val) =>
          typeof val === 'string' &&
          val.toLowerCase().includes(description.toLowerCase())
      )
    );
  }

  add(item: T): void {
    this._items = [...this._items, item];
  }

  update(id: number, item: Partial<T>): void {
    const existing = this.findById(id);
    if (!existing) {
      throw new Error(`${this.constructor.name} item with ID ${id} not found.`);
    }
    Object.assign(existing, item);
    if (typeof (existing as any).onActivity === 'function') {
      (existing as any).onActivity();
    }
  }

  delete(id: number): void {
    const existing = this.findById(id);
    if (!existing) {
      throw new Error(`${this.constructor.name} item with ID ${id} not found.`);
    }
    this._items = this._items.filter((item) => item[this.idKey] !== id);
  }
}
