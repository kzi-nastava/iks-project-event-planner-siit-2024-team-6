import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../shared/model/paged-response.model';
import { Category, CategorySuggestion } from './model/category.model';
import { NewCategoryDTO } from '../dto/category-dtos';

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

  getPagedSuggestions(page: number, pageSize: number): Observable<PagedResponse<CategorySuggestion>> {
    const token = localStorage.getItem('user'); // Assuming the JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    });

    // Set query parameters for pagination
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    // Make the GET request with headers and params
    return this.http.get<PagedResponse<CategorySuggestion>>(`${this.apiUrl}/suggestions`, { headers, params });
  }

  deleteCategory(categoryId: number): Observable<string> {
    const token = localStorage.getItem('user'); // Retrieve the JWT token from local storage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.delete<string>(`${this.apiUrl}/category/${categoryId}`, { headers });
  }

  addCategory(category: { name: string; description: string }): Observable<Category> {
    const token = localStorage.getItem('user'); // Retrieve the JWT token from local storage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.post<Category>(`${this.apiUrl}/category`, category, { headers });
  }
  

  updateCategory(id: number, updatedCategory: NewCategoryDTO): Observable<Category> {
    const token = localStorage.getItem('user'); // Assuming token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Category>(`${this.apiUrl}/category/${id}`, updatedCategory, { headers });
  }

  approveSuggestion(id: number): Observable<CategorySuggestion> {
    const token = localStorage.getItem('user'); // Assuming the JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    });

    return this.http.put<CategorySuggestion>(
      `${this.apiUrl}/suggestion/approve/${id}`, 
      {}, // No request body needed
      { headers }
    );
  }
  getAllCategories(): Observable<string[]> {
    // Retrieve the token (assuming it's stored in localStorage)
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrl}/category-names`;

    // Perform the HTTP GET request to retrieve categories
    return this.http.get<string[]>(url, { headers });
  }
  updateCategorySuggestion(id: number, dto: NewCategoryDTO): Observable<CategorySuggestion> {
    const token = localStorage.getItem('user'); // Assuming JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set Authorization header
      'Content-Type': 'application/json' // Ensure correct content type
    });

    return this.http.put<CategorySuggestion>(`${this.apiUrl}/suggestion/${id}`, dto, { headers });
  }
}
