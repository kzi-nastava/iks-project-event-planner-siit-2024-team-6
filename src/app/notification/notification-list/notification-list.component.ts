import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../model/notification.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { WebSocketService } from '../../shared/services/web-socket.service';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService, private authService: AuthService, private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log(userId);
    this.notificationService.getUserNotifications(userId).subscribe({
      next: (data) => {
        this.notifications = data;
        console.log(this.notifications);
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
      }
    });
    // Listen to real-time notifications
    this.webSocketService.notifications$.subscribe({
      next: (realTimeNotification) => {
        if (realTimeNotification) {
          this.notifications.unshift(realTimeNotification); // Add to the top of the list
        }
      },
      error: (err) => console.error('WebSocket error:', err),
    });
  }
}
