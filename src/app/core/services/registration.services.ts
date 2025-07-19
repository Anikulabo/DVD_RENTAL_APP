import { Injectable } from '@angular/core';
import {
  AddressRepository,
  CityRepository,
  CountryRepository,
  CustomerRepository,
  StaffRepository,
  StoreRepository,
} from '../repository';
import { Address, City, Country, Customer, Staff,CustomerSummaryDTO,CustomerRegistrationDTO,CustomerAction } from '../model';
@Injectable({ providedIn: 'root' })
export class RegistrationServices {
    rentalRepo: any;
    paymentRepo: any;
  constructor(
    private customerRepo: CustomerRepository,
    private staffRepo: StaffRepository,
    private addressRepo: AddressRepository,
    private storeRepo: StoreRepository,
    private cityRepo: CityRepository,
    private countryRepo: CountryRepository
  ) {}
private getStoreWithLeastCustomers(): number {
    const stores = this.storeRepo.getAll();
    const storeCustomerCounts = stores.map(store => ({
        storeId: store.storeId,
        count: this.customerRepo.getAll().filter(c => c.storeId === store.storeId).length
    }));
    return storeCustomerCounts.reduce((prev, curr) =>
        prev.count <= curr.count ? prev : curr
    ).storeId;
}
  registerOrUpdateCustomer(dto: CustomerRegistrationDTO, action: CustomerAction): void {
    // 1. Check or create Country
    let country = this.countryRepo.findByDescription(dto.countryName)[0];
    if (!country) {
        country = new Country(dto.countryName);
        this.countryRepo.add(country);
    }

    // 2. Check or create City
    let city = this.cityRepo.findByDescription(dto.cityName)[0];
    if (!city) {
        city = new City(dto.cityName, country.countryId);
        this.cityRepo.add(city);
    } else {
        const existingAddress = this.addressRepo.findByDescription(dto.district).find(
            addr => addr.cityId === city.cityId
        );
        if (existingAddress && action === 'add') {
            throw new Error(`Address already exists in city '${dto.cityName}' and district '${dto.district}'.`);
        }
    }

    // 3. Address logic (always create new address even for update for simplicity)
    const address = new Address(
        dto.addresses[0],
        dto.addresses[1] || '',
        city.cityId,
        dto.district
    );
    this.addressRepo.add(address);

    if (action === 'add') {
        // 5. Register Customer
        const customer = new Customer(
            this.getStoreWithLeastCustomers(),
            dto.firstName,
            dto.lastName,
            address.addressId,
            true
        );
        this.customerRepo.add(customer);
    } else if (action === 'update') {
        if (!dto.customerId) {
            throw new Error('CustomerId is required for update.');
        }
        this.customerRepo.update(dto.customerId, {
            firstName: dto.firstName,
            lastName: dto.lastName,
            addressId: address.addressId
        });
    }
}
getAllCustomersPaginated(page: number = 1, pageSize: number = 10): CustomerSummaryDTO[] {
    const allCustomers = this.customerRepo.getAll();
    const startIndex = (page - 1) * pageSize;
    const paginated = allCustomers.slice(startIndex, startIndex + pageSize);

    return paginated.map(customer => ({
        firstName: customer.firstName,
        lastName: customer.lastName,
        createdAt: customer.createdAt // Already a string if you used Date.toISOString()
    }));
}
deleteCustomer(id: number): void {
    const customer = this.customerRepo.findById(id);
    if (!customer) throw new Error(`Customer with ID ${id} not found.`);

    const rentals = this.rentalRepo.getAll().filter((r: { customerId: number; }) => r.customerId === id);
    if (rentals.length > 0) throw new Error(`Cannot delete customer with active rentals.`);

    const payments = this.paymentRepo.getAll().filter((p: { customerId: number; }) => p.customerId === id);
    if (payments.length > 0) throw new Error(`Cannot delete customer with payment history.`);

    // 4. Remove Address (if linked)
    this.addressRepo.delete(customer.addressId);

    // 5. Remove Customer
    this.customerRepo.delete(id);
}
 }
