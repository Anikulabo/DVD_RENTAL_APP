import { Injectable } from "@angular/core";
import { City } from "../model/city.model";
import { BaseRepository } from "./baseRepository";
@Injectable({
  providedIn: 'root',
})
export class CityRepository extends BaseRepository<City> {
  protected idKey = 'cityId';
}
