import { Injectable } from '@angular/core';
import { Customer } from '../model/customer.model';
import { BaseRepository } from './baseRepository';
@Injectable({
  providedIn: 'root',
})
export class CustomerRepository extends BaseRepository<Customer>{
    protected idKey="customerId";
    getCustomerDetailByUserId(userId: number): number | null {
        return this.getAll().find(customer => customer.userId === userId)?.customerId || null;
    }
}