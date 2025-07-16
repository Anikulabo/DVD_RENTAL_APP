import { Address } from '../model/address.model';
import { MockCrud } from './repoInterface.repo';
import { Injectable } from '@angular/core';
import { RepositoryException,NotFoundException } from '../exceptions';
@Injectable({
  providedIn: 'root',
})
export class AddressRepository implements MockCrud<Address> {
  private _AllAddresses: Address[] = [];

  getAll(): Address[] {
    return this._AllAddresses;
  }

  findById(id: number): Address | null {
    return this._AllAddresses.find(it => it.addressId === id) ?? null;
  }

  findByDescription(description: string): Address[] {
    return this._AllAddresses.filter(
      it =>
        it.address.toLowerCase() === description.toLowerCase() ||
        (it.address2?.toLowerCase() === description.toLowerCase())
    );
  }

  add(item: Address): void {
    try {
      this._AllAddresses = [...this._AllAddresses, item];
    } catch (error) {
      if (error instanceof RepositoryException) {
        console.error('Repository error:', error.message);
        throw error;
      }
      throw error;
    }
  }

  update(id: number, item: Partial<Address>): void {
    try {
      const address = this.findById(id);
      if (!address) {
        throw new NotFoundException('Address', id);
      }
      Object.assign(address, item);
      address.onActivity();
    } catch (error) {
      if (error instanceof RepositoryException) {
        console.error('Repository error:', error.message);
        throw error;
      }
      throw error;
    }
  }
  delete(id: number): void {
    const existing = this.findById(id);
    if (!existing) {
      throw new NotFoundException('Address', id);
    }
    this._AllAddresses = this._AllAddresses.filter(it => it.addressId !== id);
  }
}
