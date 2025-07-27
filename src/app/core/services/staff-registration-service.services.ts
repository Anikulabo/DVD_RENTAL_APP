import { Injectable } from '@angular/core';
import {
  AddressRepository,
  CityRepository,
  CountryRepository,
  StaffRepository,
} from '../repository';
import { AddressServiceBase } from './addressBase.services';
import { UserRepository } from '../repository/user.repo';
import { StaffRegistrationDTO } from '../model/types/StaffRegistrationDTO.types';
import { CustomerAction, Staff, UserRecord } from '../model';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StaffRegistrationServices extends AddressServiceBase {
    constructor(
        private staffRepo: StaffRepository,
        private userRepo: UserRepository,
        protected override countryRepo: CountryRepository,
        protected override cityRepo: CityRepository,
        protected override addressRepo: AddressRepository
    ) {
        super(countryRepo, cityRepo, addressRepo);
    }

    registerOrUpdateStaff(
        dto: StaffRegistrationDTO,
        action: CustomerAction,
        userId?: number
    ): Observable<void> {
        return this.ensureCountry(dto.countryName).pipe(
            switchMap(country =>
                this.ensureCity(dto.cityName, country.countryId).pipe(
                    switchMap(city =>
                        this.createAddress(dto, city.cityId).pipe(
                            switchMap(address => {
                                // Step 1: Create User
                                const user = new UserRecord(dto.username, dto.password, 'staff', dto.image);
                                this.userRepo.addUser(user);

                                // Step 3: Staff creation or update
                                if (action === 'add') {
                                    const staff = new Staff(
                                        dto.firstName,
                                        dto.lastName,
                                        user.userId,
                                        address.addressId,
                                        dto.storeId,
                                        dto.email
                                    );
                                    this.staffRepo.add(staff);
                                } else if (action === 'update') {
                                    if (!dto.staffId) {
                                        throw new Error('StaffId is required for update.');
                                    }
                                    this.staffRepo.update(dto.staffId, {
                                        firstName: dto.firstName,
                                        lastName: dto.lastName,
                                        addressId: address.addressId,
                                        ...(userId ? { userId } : {})
                                    });
                                }
                                return new Observable<void>(subscriber => {
                                    subscriber.next();
                                    subscriber.complete();
                                });
                            })
                        )
                    )
                )
            ),
            catchError(error => {
                if (error instanceof Error) {
                    return throwError(() => error.message);
                } else {
                    return throwError(() => 'Unknown error during staff registration');
                }
            })
        );
    }
}