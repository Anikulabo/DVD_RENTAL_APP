import { Injectable } from '@angular/core';
import { MockCrud } from './repoInterface.repo';
import { Customer } from '../model/customer.model';
import { RepositoryException } from '../exceptions/repository.exception';
import { NotFoundException } from '../exceptions/not-found.exception';
@Injectable({
  providedIn: 'root',
})
export class CustomerRepository implements MockCrud<Customer> {
    private _allCustomers: Customer[] = [];

    getAll(): Customer[] {
        return this._allCustomers;
    }

    findById(id: number): Customer | null {
        return this._allCustomers.find(it => it.customerId === id) ?? null;
    }

    findByDescription(description: string): Customer[] {
        return this._allCustomers.filter(
            it => it.firstName.includes(description) || it.lastName.includes(description)
        );
    }

    add(item: Customer): void {
        try {
            if (this.findById(item.customerId)) {
                throw new RepositoryException(`Customer with ID ${item.customerId} already exists.`);
            }
            this._allCustomers.push(item);
        } catch (error) {
            if (error instanceof RepositoryException) {
                console.error('Repository error:', error.message);
                throw error;
            }
            throw error;
        }
    }

    update(id: number, item: Partial<Customer>): void {
        try {
            const customer = this.findById(id);
            if (!customer) {
                throw new NotFoundException('Customer', id);
            }
            Object.assign(customer, item);
            customer.onActivity();
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
            throw new NotFoundException('Customer', id);
        }
        this._allCustomers = this._allCustomers.filter(it => it.customerId !== id);
    }
}
