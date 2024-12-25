import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../shared/model/paged-response.model';
import { Category } from './model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/admins'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getPagedCategories(page: number, pageSize: number): Observable<PagedResponse<Category>> {
    const token = localStorage.getItem('user'); // Assuming the JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    });

    // Set query parameters for pagination
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    // Make the GET request with headers and params
    return this.http.get<PagedResponse<Category>>(`${this.apiUrl}/categories`, { headers, params });
  }

  deleteCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/category/${categoryId}`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/category/${category.id}`, category);
  }
}
