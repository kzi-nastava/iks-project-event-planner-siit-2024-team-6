import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from './model/notification.model';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = '/api/notifications';

  constructor(private http: HttpClient) {}

  getUserNotifications(receiverId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/receiver/${receiverId}`);
  }
}
