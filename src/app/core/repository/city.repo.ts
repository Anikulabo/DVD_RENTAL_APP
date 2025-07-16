import { Injectable } from "@angular/core";
import { MockCrud } from "./repoInterface.repo";
import { City } from "../model/city.model";
import { RepositoryException,NotFoundException } from "../exceptions";
@Injectable({
  providedIn: 'root',
})
export class CityRepository implements MockCrud<City> {
  private _allCities: City[] = [];

  getAll(): City[] {
    return this._allCities;
  }

  findById(id: number): City | null {
    return this._allCities.find(it => it.cityId === id) ?? null;
  }

  findByDescription(description: string): City[] {
    return this._allCities.filter(
      it => it.city.toLowerCase().includes(description.toLowerCase())
    );
  }

  add(item: City): void {
    try {
      this._allCities = [...this._allCities, item];
    } catch (error) {
      if (error instanceof RepositoryException) {
        console.error('Repository error:', error.message);
        throw error;
      }
      throw error;
    }
  }

  update(id: number, item: Partial<City>): void {
    try {
      const city = this.findById(id);
      if (!city) {
        throw new NotFoundException('City', id);
      }
      Object.assign(city, item);
      city.onActivity();
    } catch (error) {
      if (error instanceof RepositoryException) {
        console.error('Repository error:', error.message);
        throw error;
      }
      throw error;
    }
  }

  delete(id: number): void {
    const existing = this.findById(id);
    if (!existing) {
      throw new NotFoundException('City', id);
    }
    this._allCities = this._allCities.filter(it => it.cityId !== id);
  }
}