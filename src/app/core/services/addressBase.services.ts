import { Address, City, Country } from "../model";
import { AddressRepository, CityRepository, CountryRepository } from "../repository";

export abstract class AddressServiceBase {
    constructor(
        protected countryRepo: CountryRepository,
        protected cityRepo: CityRepository,
        protected addressRepo: AddressRepository
    ) {}

    protected ensureCountry(countryName: string): Country {
        let country = this.countryRepo.findByDescription(countryName)[0];
        if (!country) {
            country = new Country(countryName);
            this.countryRepo.add(country);
        }
        return country;
    }

    protected ensureCity(cityName: string, countryId: number): City {
        let city = this.cityRepo.findByDescription(cityName)[0];
        // to check if that 
        if (!city) {
            city = new City(cityName, countryId);
            this.cityRepo.add(city);
        }
        return city;
    }

    protected createAddress(dto: { addresses: string[]; district: string }, cityId: number): Address {
        const address = new Address(
            dto.addresses[0],
            dto.addresses[1] || '',
            cityId,
            dto.district
        );
        this.addressRepo.add(address);
        return address;
    }
}
