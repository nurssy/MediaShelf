import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MediaItem {
  _id?: string;
  name: string;
  image: string | null;
  addedDate?: Date;
  rating: number;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string; // Backend'deki alan
  createdAt?: Date;     // Backend'de otomatik geliyor
  items: MediaItem[];
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addMediaItem(categoryId: string, item: MediaItem): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/${categoryId}/items`, item);
  }

  deleteMediaItem(categoryId: string, itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${categoryId}/items/${itemId}`);
  }
}
