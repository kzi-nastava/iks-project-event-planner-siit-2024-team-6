import { Injectable } from '@angular/core';
import { Client, IMessage, IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Notification } from '../../notification/model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private notificationSubject = new BehaviorSubject<Notification | null>(null);

  constructor(private authService: AuthService) {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    this.client.webSocketFactory = () => new SockJS('http://localhost:8080/ws') as unknown as IStompSocket;

    // Subscribe to user-specific notifications
    this.client.onConnect = () => {
      const userId = this.authService.getUserId();
      if (userId) {
        this.client.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
          const notification: Notification = JSON.parse(message.body); // Deserialize message to DTO
          this.notificationSubject.next(notification);
        });
      }
    };

    this.client.activate();
  }

  get notifications$(): Observable<Notification | null> {
    return this.notificationSubject.asObservable();
  }

}
