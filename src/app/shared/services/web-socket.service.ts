import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs'; // Create this interface
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Notification } from '../../notification/model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private notificationSubject = new BehaviorSubject<Notification | null>(null);

  constructor(private authService: AuthService) {
    this.connect();
  }

  private connect() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // WebSocket endpoint
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // Auto-reconnect after 5 seconds
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      const userId = this.authService.getUserId();
      if (userId) {
        this.stompClient.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
          const notification = JSON.parse(message.body) as Notification;
          this.notificationSubject.next(notification);
        });
      }
    };

    this.stompClient.activate();
  }

  get notifications$(): Observable<Notification | null> {
    return this.notificationSubject.asObservable();
  }
}
