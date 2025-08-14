import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categories'; // API base URL - adjust as needed

  constructor(private http: HttpClient) { }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Get category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Create new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  // Update existing category
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  // Delete category
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search categories by name
  searchCategories(query: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/search?q=${query}`);
  }

  // Get categories with pagination
  getCategoriesWithPagination(page: number = 1, limit: number = 10): Observable<{categories: Category[], total: number, page: number, limit: number}> {
    return this.http.get<{categories: Category[], total: number, page: number, limit: number}>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
}
