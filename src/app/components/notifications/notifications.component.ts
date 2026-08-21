import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification-service';
import { NotificationType } from 'src/app/enums/notification-type-enum';
import { Alert } from 'src/app/models/alert';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  standalone: false,
})
export class NotificationsComponent implements OnInit {
  
  notifications: Alert[] = [];
  currentPage = 1;
  readonly pageSize = 10;

  constructor(
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  /* ==========================================================
     PAGINATION
     ========================================================== */

  get paginatedNotifications(): Alert[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.notifications.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.notifications.length / this.pageSize));
  }

  get hasPagination(): boolean {
    return this.totalPages > 1;
  }

  get pages(): number[] {
    return Array.from(
      {
        length: this.totalPages,
      },
      (_, index) => index + 1,
    );
  }

  /* ==========================================================
     STATE
     ========================================================== */

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.read)
      .length;
  }

  get hasNotifications(): boolean {
    return this.notifications.length > 0;
  }

  /* ==========================================================
     OPEN NOTIFICATION
     ========================================================== */

  openNotification(notification: Alert): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }

    if (!notification.route) {
      return;
    }

    this.router.navigate([notification.route], {
      queryParams: notification.metadata,
    });
  }

  /* ==========================================================
     PAGINATION
     ========================================================== */

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  /* ==========================================================
     ICON
     ========================================================== */

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.Like:
        return 'fa-solid fa-heart';

      case NotificationType.Follow:
        return 'fa-solid fa-user-plus';

      case NotificationType.Playlist:
        return 'fa-solid fa-list';

      case NotificationType.Upload:
        return 'fa-solid fa-cloud-arrow-up';

      case NotificationType.Message:
        return 'fa-solid fa-message';

      case NotificationType.System:
      default:
        return 'fa-solid fa-bell';
    }
  }

  /* ==========================================================
     LABEL
     ========================================================== */

  getNotificationLabel(type: NotificationType): string {
    switch (type) {
      case NotificationType.Like:
        return 'Like';

      case NotificationType.Follow:
        return 'Follower';

      case NotificationType.Playlist:
        return 'Playlist';

      case NotificationType.Upload:
        return 'Upload';

      case NotificationType.Message:
        return 'Message';

      case NotificationType.System:
      default:
        return 'System';
    }
  }

  /* ==========================================================
     TIME
     ========================================================== */

  getNotificationTime(timestamp: Date): string {
    const difference = Math.max(0, Date.now() - new Date(timestamp).getTime());

    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return new Date(timestamp).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  /* ==========================================================
     TRACK BY
     ========================================================== */

  trackByNotificationId(index: number, notification: Alert): string {
    return notification.id;
  }
}
