import { Injectable } from '@angular/core';
import {  CountryRepository } from '../repository';
import {  Country } from '../model';
@Injectable({ providedIn: 'root' })
export class RepositorySanityTesterService {
  constructor(
    private countryRepo: CountryRepository
  ) {}
  runtest() {
    this.testCountryRepository();
  }
  private testCountryRepository() {
    console.log('--- Testing Country Repository ---');

    const country = new Country('Nigeria');
    this.countryRepo.add(country);
    console.log('Added:', this.countryRepo.getAll());

    this.countryRepo.update(country.countryId, { country: 'Ghana' });
    console.log('Updated:', this.countryRepo.findById(country.countryId));

    console.log(
      'FindByDescription:',
      this.countryRepo.findByDescription('Ghana')
    );

    this.countryRepo.delete(country.countryId);
    console.log('After Delete:', this.countryRepo.getAll());
  }
}
