import { Injectable } from '@angular/core';
import {
  AddressRepository,
  CityRepository,
  CountryRepository,
  CustomerRepository,
  PaymentRepository,
  RentalRepository,
  StoreRepository,
  InventoryRepository,
  FilmRepository,
} from '../repository';
import {
  Customer,
  UserRecord,
  CustomerSummaryDTO,
  CustomerRegistrationDTO,
  CustomerAction,
  CustomerDetailDTO,
} from '../model';
import { UserRepository } from '../repository/user.repo';
import { AddressServiceBase } from './addressBase.services';
@Injectable({ providedIn: 'root' })
export class CustomersRegistrationServices extends AddressServiceBase {
  constructor(
    private customerRepo: CustomerRepository,
    private rentalRepo: RentalRepository,
    private paymentRepo: PaymentRepository,
    private userRepo: UserRepository,
    protected newAddressRepo: AddressRepository,
    private storeRepo: StoreRepository,
    protected newCityRepo: CityRepository,
    protected newCountryRepo: CountryRepository,
    private inventoryRepo: InventoryRepository,
    private filmRepo: FilmRepository
  ) {
    super(newCountryRepo, newCityRepo, newAddressRepo);
  }
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
    if (customer.userId !== null) {
      this.userRepo.delete(customer.userId);
    }
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
    const city = this.ensureCity(dto.cityName, country.countryId);
    const address = this.createAddress(dto, city.cityId);

    this.createOrUpdateCustomer(
      dto,
      action,
      address.addressId,
      user.userId,
      userId
    );
  }
  // method to get all customer in a paginated format
  getAllCustomersPaginated(
    storeId: number,
    page: number = 1,
    pageSize: number = 10
  ): CustomerSummaryDTO[] {
    const storeCustomers = this.customerRepo
      .getAll()
      .filter((c) => c.storeId === storeId);
    const startIndex = (page - 1) * pageSize;
    const paginated = storeCustomers.slice(startIndex, startIndex + pageSize);

    return paginated.map((customer) => ({
      firstName: customer.firstName,
      lastName: customer.lastName,
      createdAt: customer.createdAt,
    }));
  }
  // method to get the detail of a single customer
  getCustomerDetailById(customerId: number): CustomerDetailDTO {
    const customer = this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const address = this.addressRepo.findById(customer.addressId);

    const rentals = this.rentalRepo
      .getAll()
      .filter((r) => r.customerId === customerId);

    const rentalDetails = rentals.map((rental) => {
      const inventory = this.inventoryRepo.findById(rental.inventoryId);
      const filmTitle = inventory
        ? this.filmRepo.findById(inventory.filmId)?.title
        : 'Unknown';
      return {
        rentalDate: rental.rentalDate.toDateString(),
        returnDate: rental.returnDate?.toDateString(),
        filmTitle: filmTitle ?? 'Unknown',
      };
    });

    const payments = this.paymentRepo
      .getAll()
      .filter((p) => p.customerId === customerId);
    const totalAmountSpent = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      fullName: `${customer.firstName} ${customer.lastName}`,
      address: address
        ? `${address.address}, ${address.district}`
        : 'Address not found',
      rentals: rentalDetails,
      totalAmountSpent,
      createdAt: customer.createdAt,
      active: customer.active,
    };
  }
  // method to remove customer
  deleteCustomer(id: number): void {
    const customer = this.customerRepo.findById(id);
    if (!customer) throw new Error(`Customer with ID ${id} not found.`);

    const rentals = this.rentalRepo
      .getAll()
      .filter((r: { customerId: number }) => r.customerId === id);
    const payments = this.paymentRepo
      .getAll()
      .filter((p: { customerId: number }) => p.customerId === id);

    if (rentals.length === 0 && payments.length === 0) {
      this.fullyRemoveCustomer(customer);
    } else {
      if (customer.userId !== null) {
        this.blockCustomerLogin(customer.customerId, customer.userId);
      }
    }
  }
}
