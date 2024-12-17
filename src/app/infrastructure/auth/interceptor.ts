import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
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
      
      return next.handle(cloned);
    }

    // Если токена нет, просто отправляем запрос
    console.log(`[Interceptor] No token found for request: ${req.url}`);
    return next.handle(req);
  }
}
