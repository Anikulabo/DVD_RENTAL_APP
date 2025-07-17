import { Address } from '../model/address.model';
import { Injectable } from '@angular/core';
import { BaseRepository } from './baseRepository';
@Injectable({
  providedIn: 'root',
})
export class AddressRepository extends BaseRepository<Address>{
  protected idKey="addressId"
}
