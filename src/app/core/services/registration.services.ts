import { Injectable } from '@angular/core';
import {
  AddressRepository,
  CityRepository,
  CountryRepository,
  CustomerRepository,
  StaffRepository,
  StoreRepository,
} from '../repository';
import {
  Address,
  City,
  Country,
  Customer,
  Staff,
  UserRecord,
  CustomerSummaryDTO,
  CustomerRegistrationDTO,
  CustomerAction,
} from '../model';
import { UserRepository } from '../repository/user.repo';
@Injectable({ providedIn: 'root' })
export class RegistrationServices {
  rentalRepo: any;
  paymentRepo: any;
  constructor(
    private customerRepo: CustomerRepository,
    private staffRepo: StaffRepository,
    private userRepo: UserRepository,
    private addressRepo: AddressRepository,
    private storeRepo: StoreRepository,
    private cityRepo: CityRepository,
    private countryRepo: CountryRepository
  ) {}
  // private method to get the store with least customers
  private getStoreWithLeastCustomers(): number {
    const stores = this.storeRepo.getAll();
    const storeCustomerCounts = stores.map((store) => ({
      storeId: store.storeId,
      count: this.customerRepo
        .getAll()
        .filter((c) => c.storeId === store.storeId).length,
    }));
    return storeCustomerCounts.reduce((prev, curr) =>
      prev.count <= curr.count ? prev : curr
    ).storeId;
  }
 private ensureCountry(countryName: string): Country {
    let country = this.countryRepo.findByDescription(countryName)[0];
    if (!country) {
        country = new Country(countryName);
        this.countryRepo.add(country);
    }
    return country;
}

private ensureCity(cityName: string, countryId: number, district: string, action: CustomerAction): City {
    let city = this.cityRepo.findByDescription(cityName)[0];
    if (!city) {
        city = new City(cityName, countryId);
        this.cityRepo.add(city);
    } else {
        const existingAddress = this.addressRepo
            .findByDescription(district)
            .find(addr => addr.cityId === city.cityId);
        if (existingAddress && action === 'add') {
            throw new Error(
                `Address already exists in city '${cityName}' and district '${district}'.`
            );
        }
    }
    return city;
}

private createAddress(dto: CustomerRegistrationDTO, cityId: number): Address {
    const address = new Address(
        dto.addresses[0],
        dto.addresses[1] || '',
        cityId,
        dto.district
    );
    this.addressRepo.add(address);
    return address;
}

private createOrUpdateCustomer(
    dto: CustomerRegistrationDTO,
    action: CustomerAction,
    addressId: number,
    userRecordId: number,
    existingUserId?: number
): void {
    if (action === 'add') {
        const customer = new Customer(
            dto.firstName,
            dto.lastName,
            addressId,
            userRecordId,
            this.getStoreWithLeastCustomers()
        );
        this.customerRepo.add(customer);
    } else if (action === 'update') {
        if (!dto.customerId) {
            throw new Error('CustomerId is required for update.');
        }
        this.customerRepo.update(dto.customerId, {
            firstName: dto.firstName,
            lastName: dto.lastName,
            addressId: addressId,
        });
        if (existingUserId) {
            this.customerRepo.update(dto.customerId, {
                userId: existingUserId,
            });
        }
    }
}
private fullyRemoveCustomer(customer: Customer): void {
    this.addressRepo.delete(customer.addressId);
    if(customer.userId!==null){
    this.userRepo.delete(customer.userId)  
    };
    this.customerRepo.delete(customer.customerId);
}

private blockCustomerLogin(customerId: number, userId: number): void {
    this.userRepo.delete(userId);
    this.customerRepo.update(customerId, { userId: null });
}

registerOrUpdateCustomer(
    dto: CustomerRegistrationDTO,
    action: CustomerAction,
    userId?: number
): void {
    let user: UserRecord;
    try {
        user = new UserRecord(dto.username, dto.password, 'customer', dto.image);
        this.userRepo.addUser(user);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            console.error('Unexpected error:', error);
            throw new Error('Unknown error creating user');
        }
    }

    const country = this.ensureCountry(dto.countryName);
    const city = this.ensureCity(dto.cityName, country.countryId, dto.district, action);
    const address = this.createAddress(dto, city.cityId);

    this.createOrUpdateCustomer(dto, action, address.addressId, user.userId, userId);
}
  // method to get all customer in a paginated format
  getAllCustomersPaginated(
    page: number = 1,
    pageSize: number = 10
  ): CustomerSummaryDTO[] {
    const allCustomers = this.customerRepo.getAll();
    const startIndex = (page - 1) * pageSize;
    const paginated = allCustomers.slice(startIndex, startIndex + pageSize);

    return paginated.map((customer) => ({
      firstName: customer.firstName,
      lastName: customer.lastName,
      createdAt: customer.createdAt, // Already a string if you used Date.toISOString()
    }));
  }
  // method to remove customer
  deleteCustomer(id: number): void {
    const customer = this.customerRepo.findById(id);
    if (!customer) throw new Error(`Customer with ID ${id} not found.`);

    const rentals = this.rentalRepo.getAll().filter((r: { customerId: number; }) => r.customerId === id);
    const payments = this.paymentRepo.getAll().filter((p: { customerId: number; }) => p.customerId === id);

    if (rentals.length === 0 && payments.length === 0) {
        this.fullyRemoveCustomer(customer);
    } else {
      if(customer.userId!==null){  
      this.blockCustomerLogin(customer.customerId, customer.userId);
      }}
}
}
