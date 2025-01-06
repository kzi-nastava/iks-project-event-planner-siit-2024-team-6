import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../model/notification.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService, private authService: AuthService) {}

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
  }
}
