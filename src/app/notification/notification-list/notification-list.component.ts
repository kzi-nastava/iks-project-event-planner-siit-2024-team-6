import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../model/notification.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { WebSocketService } from '../../shared/services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private notificationSubscription!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private webSocketService: WebSocketService // ✅ Inject WebSocket Service
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log(userId);

    // Fetch existing notifications from API
    this.notificationService.getUserNotifications(userId).subscribe({
      next: (data) => {
        this.notifications = data;
        console.log('Existing Notifications:', this.notifications);
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
      }
    });

    // Subscribe to real-time notifications via WebSockets
    this.notificationSubscription = this.webSocketService.notifications$.subscribe({
      next: (notification) => {
        if (notification) {
          this.notifications.unshift(notification); // Add new notification to the top
          console.log('New Notification Received:', notification);
        }
      },
      error: (err) => console.error('WebSocket Error:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }
}
