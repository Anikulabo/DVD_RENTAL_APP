import { Observable, of } from "rxjs";
import { Address, City, Country } from "../model";
import { AddressRepository, CityRepository, CountryRepository } from "../repository";

export abstract class AddressServiceBase {
  constructor(
    protected countryRepo: CountryRepository,
    protected cityRepo: CityRepository,
    protected addressRepo: AddressRepository
  ) {}

  protected ensureCountry(countryName: string): Observable<Country> {
    let country = this.countryRepo.findByDescription(countryName)[0];
    if (!country) {
      country = new Country(countryName);
      this.countryRepo.add(country);
    }
    return of(country);
  }

  protected ensureCity(cityName: string, countryId: number): Observable<City> {
    let city = this.cityRepo.findByDescription(cityName)[0];
    if (!city) {
      city = new City(cityName, countryId);
      this.cityRepo.add(city);
    }
    return of(city);
  }

  protected createAddress(
    dto: { addresses: string[]; district: string },
    cityId: number
  ): Observable<Address> {
    const address = new Address(
      dto.addresses[0],
      dto.addresses[1] || '',
      cityId,
      dto.district
    );
    this.addressRepo.add(address);
    return of(address);
  }
}