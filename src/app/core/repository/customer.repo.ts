import { Injectable } from '@angular/core';
import { Customer } from '../model/customer.model';
import { BaseRepository } from './baseRepository';
@Injectable({
  providedIn: 'root',
})
export class CustomerRepository extends BaseRepository<Customer>{
    protected idKey="customerId"
}