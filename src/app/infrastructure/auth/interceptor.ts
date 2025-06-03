import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Получаем токен из localStorage
    const accessToken = localStorage.getItem('user');
    
    // Пропускаем запросы, помеченные заголовком "skip"
    if (req.headers.get('skip')) {
      console.log(`[Interceptor] Skipping token for request: ${req.url}`);
      return next.handle(req);
    }

    // Если токен существует, добавляем его в заголовок "Authorization"
    if (accessToken) {
      console.log(`[Interceptor] Adding token to request: ${req.url}`);
      console.log(`[Interceptor] Token: Bearer ${accessToken}`);
      
      const cloned = req.clone({
        headers: req.headers.set('X-Auth-Token', 'Bearer ' + accessToken),
      });
      
      return next.handle(cloned).pipe(
      catchError(err => this.handleError(err))
    );
    }

    // Если токена нет, просто отправляем запрос
    console.log(`[Interceptor] No token found for request: ${req.url}`);
    return next.handle(req);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Check if error body contains token expired message
          if (error.error && typeof error.error === 'object' && error.error.error === 'Token expired') {
            console.log('Token expired - redirecting to login');
            if (localStorage.getItem('user')) {
              this.snackBar.open('Session expired. Please login again.', '', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            }
            localStorage.removeItem('user');
            this.router.navigate(['/login']);

          }
        }
    return throwError(() => error);
  }
}
