import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification, NewNotificationDTO } from './model/notification.model';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../env/environment';
import { PagedResponse } from '../shared/model/paged-response.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = '/api/notifications/';
  private stompClient: Client;
  private readonly socketUrl = 'http://localhost:8080/socket';
  private subscriptions: StompSubscription[] = [];
  private connectedPromise!: Promise<void>;
  private connectedResolve!: () => void;

  constructor(private http: HttpClient) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.socketUrl),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('✅ STOMP connected');
      this.connectedResolve();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ STOMP error', frame);
    };

    this.stompClient.onDisconnect = () => {
      console.log('⚠️ STOMP disconnected');
    };
  }

  connect(): Promise<void> {
    if (this.stompClient.active) {
      return Promise.resolve();
    }

    this.connectedPromise = new Promise((resolve) => {
      this.connectedResolve = resolve;
    });

    this.stompClient.activate();

    return this.connectedPromise;
  }

  getUserNotifications(receiverId: number, page = 0, size = 5): Observable<PagedResponse<Notification>> {
    return this.http.get<PagedResponse<Notification>>(`${this.baseUrl}/receiver/${receiverId}`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sortBy: 'timestamp',
        sortDir: 'desc'
      }
    });
  }

  createNotification(dto: NewNotificationDTO): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}`, dto);
  }
  
  async subscribeToUserNotifications(userId: number, callback: (message: IMessage) => void): Promise<void> {
    await this.connectedPromise;  // wait for STOMP connection
    const subscription = this.stompClient.subscribe(
      `/socket-publisher/notifications/${userId}`,
      callback
    );
    this.subscriptions.push(subscription);
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.stompClient.deactivate();
    console.log("DISCONNNECTED FROM SOCKET")
  }
}
