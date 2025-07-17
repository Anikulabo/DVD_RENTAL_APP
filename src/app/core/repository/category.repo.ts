import { Injectable } from '@angular/core';
import { Category } from '../model/category.model';
import { BaseRepository } from './baseRepository';
@Injectable({
  providedIn: 'root',
})
export class CategoryRepository extends BaseRepository<Category> {
  protected idKey="categoryId"
}
