import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from '../../../env/environment';
import {AuthResponse} from './model/auth-response.model';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  user$ = new BehaviorSubject("");
  userState = this.user$.asObservable();

  constructor(private http: HttpClient) {
    this.user$.next(this.getRole());
  }

  login(auth: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.apiHost + '/users/login', auth, {
      headers: this.headers,
    });
  }

  getRole(): any {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      return helper.decodeToken(accessToken).role;
    }
    return null;
  }
  getUserId(): number | null {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(accessToken);
      return decodedToken.userId ? Number(decodedToken.userId) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    const accessToken: any = localStorage.getItem('user');
    const helper = new JwtHelperService();
    if(localStorage.getItem('user') != null){
      if (!helper.isTokenExpired(accessToken)){
        return true;
      }
    }
    return false;
  }

  setUser(): void {
    this.user$.next(this.getRole());
  }

  logout(): void {
    console.log('[AuthService] Logging out user...');
    localStorage.removeItem('user'); // Удаляем токен из localStorage
    this.user$.next(null); // Сбрасываем роль пользователя
  }
}
