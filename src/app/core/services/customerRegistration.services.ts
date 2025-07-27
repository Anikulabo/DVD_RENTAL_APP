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
  Country,
} from '../model';
import { UserRepository } from '../repository/user.repo';
import { AddressServiceBase } from './addressBase.services';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
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

  // ✅ PRIVATE methods remain untouched
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

  // ✅ PUBLIC methods now return Observable<T>
  registerOrUpdateCustomer(
    dto: CustomerRegistrationDTO,
    action: CustomerAction,
    userId?: number
  ): Observable<void> {
    try {
      const user = new UserRecord(
        dto.username,
        dto.password,
        'customer',
        dto.image
      );
      this.userRepo.addUser(user);

      return this.ensureCountry(dto.countryName).pipe(
        switchMap((country: Country) =>
          this.ensureCity(dto.cityName, country.countryId).pipe(
            switchMap((city) =>
              this.createAddress(dto, city.cityId).pipe(
                switchMap((address) => {
                  this.createOrUpdateCustomer(
                    dto,
                    action,
                    address.addressId,
                    user.userId,
                    userId
                  );
                  return of(undefined);
                })
              )
            )
          )
        ),
        catchError((error) => {
          const message =
            error instanceof Error
              ? error.message
              : 'Unknown error creating user';
          return throwError(() => new Error(message));
        })
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error creating user';
      return throwError(() => new Error(message));
    }
  }

  getCustomerRegitrationDetailByCustomerId(
    customerId: number
  ): Observable<CustomerRegistrationDTO | null> {
    const customer = this.customerRepo
      .getAll()
      .find((c) => c.customerId === customerId);
    if (!customer) {
      return throwError(
        () => new Error(`Customer with ID ${customerId} not found.`)
      );
    }
    const address = this.addressRepo.findById(customer.addressId);
    const dto: CustomerRegistrationDTO = {
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      addresses: address
        ? address.address2
          ? [address.address, address.address2]
          : [address.address]
        : [],
      cityName: address
        ? this.cityRepo.findById(address.cityId)?.city ?? ''
        : '',
      countryName: address
        ? (() => {
            const city = this.cityRepo.findById(address.cityId);
            if (city) {
              const country = this.countryRepo.findById(city.countryId);
              return country ? country.country : '';
            }
            return '';
          })()
        : '',
      username: '', // fill if available
      password: '', // fill if available
      image: '', // fill if available
      district: address ? address.district : '', // fill if available
      // fill if available
    };
    return of(dto);
  }
  getAllCustomersPaginated(
    storeId: number,
    page: number = 1,
    pageSize: number = 10
  ): Observable<CustomerSummaryDTO[]> {
    const storeCustomers = this.customerRepo
      .getAll()
      .filter((c) => c.storeId === storeId);
    const startIndex = (page - 1) * pageSize;
    const paginated = storeCustomers.slice(startIndex, startIndex + pageSize);

    const result = paginated.map((customer) => ({
      firstName: customer.firstName,
      lastName: customer.lastName,
      createdAt: customer.createdAt,
    }));
    return of(result);
  }

  getCustomerDetailById(customerId: number): Observable<CustomerDetailDTO> {
    const customer = this.customerRepo.findById(customerId);
    if (!customer) {
      return throwError(
        () => new Error(`Customer with ID ${customerId} not found.`)
      );
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
        rentalId: rental.rentalId,
        rentalDate: rental.rentalDate.toDateString(),
        returnDate: rental.returnDate?.toDateString(),
        filmTitle: filmTitle ?? 'Unknown',
      };
    });

    const payments = this.paymentRepo
      .getAll()
      .filter((p) => p.customerId === customerId);
    const totalAmountSpent = payments.reduce((sum, p) => sum + p.amount, 0);

    const detail: CustomerDetailDTO = {
      fullName: `${customer.firstName} ${customer.lastName}`,
      address: address
        ? `${address.address}, ${address.district}`
        : 'Address not found',
      rentals: rentalDetails,
      totalAmountSpent,
      createdAt: customer.createdAt,
      active: customer.active,
    };

    return of(detail);
  }

  deleteCustomer(id: number): Observable<void> {
    const customer = this.customerRepo.findById(id);
    if (!customer) {
      return throwError(() => new Error(`Customer with ID ${id} not found.`));
    }

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

    return of(undefined);
  }
}
