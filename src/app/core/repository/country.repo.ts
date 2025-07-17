import { Injectable } from '@angular/core';
import { BaseRepository } from '.';
import { Country } from '../model/country.model';
@Injectable({
  providedIn: 'root',
})
export class CountryRepository extends BaseRepository<Country> {
  protected idKey = 'countryId';
}
