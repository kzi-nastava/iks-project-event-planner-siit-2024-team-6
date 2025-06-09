import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../model/notification.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { IMessage } from '@stomp/stompjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private userId!: number;

  pageProperties = {
    pageIndex: 0,
    pageSize: 5,
    totalCount: 0,
    pageSizeOptions: [5, 10, 20]
  };

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = this.authService.getUserId();

    await this.notificationService.connect();

    this.loadUserNotifications();

    await this.notificationService.subscribeToUserNotifications(this.userId, (message: IMessage) => {
      const notification = JSON.parse(message.body) as Notification;
      this.notifications.unshift(notification);
      this.pageProperties.totalCount++;
    });
  }

  private loadUserNotifications(): void {
    this.notificationService.getUserNotifications(
      this.userId,
      this.pageProperties.pageIndex,
      this.pageProperties.pageSize
    ).subscribe({
      next: (response) => {
        this.notifications = response.content;
        this.pageProperties.totalCount = response.totalElements;
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
      }
    });
  }

  pageChanged(event: PageEvent): void {
    this.pageProperties.pageIndex = event.pageIndex;
    this.pageProperties.pageSize = event.pageSize;
    this.loadUserNotifications();
  }

  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }
}
