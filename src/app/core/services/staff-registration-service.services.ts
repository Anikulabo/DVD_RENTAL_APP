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
    ): void {
        // 1️⃣ Create User First
        let user: UserRecord;
        try {
            user = new UserRecord(dto.username, dto.password, 'staff', dto.image);
            this.userRepo.addUser(user);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                console.error('Unexpected error:', error);
                throw new Error('Unknown error creating staff user');
            }
        }

        // 2️⃣ Address Flow
        const country = this.ensureCountry(dto.countryName);
        const city = this.ensureCity(dto.cityName, country.countryId);
        const address = this.createAddress(dto, city.cityId);

        // 3️⃣ Staff Creation / Update
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
                addressId: address.addressId
            });
            if (userId) {
                this.staffRepo.update(dto.staffId, { userId });
            }
        }
    }
}
