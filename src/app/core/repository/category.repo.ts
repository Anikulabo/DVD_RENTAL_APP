import { Injectable } from '@angular/core';
import { MockCrud } from './repoInterface.repo';
import { Category } from '../model/category.model';
import { RepositoryException } from '../exceptions/repository.exception';
import { NotFoundException } from '../exceptions/not-found.exception';
Injectable({
  providedIn: 'root',
})
export class CategoryRepository implements MockCrud<Category> {
  private _allcategory: Category[] = [];

  getAll(): Category[] {
    return this._allcategory;
  }

  findById(id: number): Category | null {
    return this._allcategory.find(it => it.categoryId === id) ?? null;
  }

  findByDescription(description: string): Category[] {
    return this._allcategory.filter(it =>
      it.name.toLowerCase().includes(description.toLowerCase())
    );
  }

  add(item: Category): void {
    try {
      if (this.findById(item.categoryId)) {
        throw new RepositoryException(`Category with ID ${item.categoryId} already exists.`);
      }
      this._allcategory.push(item);
    } catch (error) {
      if (error instanceof RepositoryException) {
        console.error('Repository error:', error.message);
        throw error;
      }
      throw error;
    }
  }

  update(id: number, item: Partial<Category>): void {
    try {
      const category = this.findById(id);
      if (!category) {
        throw new NotFoundException('Category', id);
      }
      Object.assign(category, item);
      category.onActivity();
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
      throw new NotFoundException('Category', id);
    }
    this._allcategory = this._allcategory.filter(it => it.categoryId !== id);
  }
}
