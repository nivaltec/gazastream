import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Alert } from 'src/app/models/alert';
import { NotificationType } from 'src/app/enums/notification-type-enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Alert[]>([]);

  readonly notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  getNotifications(): Observable<Alert[]> {
    return this.notifications$;
  }

  private loadNotifications(): void {
    const notifications: Alert[] = [
      {
        id: 'notification-001',
        type: NotificationType.Like,
        title: 'New like',
        message: 'Someone liked your track "Jerusalem".',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        route: '/music',
        metadata: {
          trackId: 'track-001',
        },
      },

      {
        id: 'notification-002',
        type: NotificationType.Follow,
        title: 'New follower',
        message: 'Someone started following you.',
        timestamp: new Date(Date.now() - 24 * 60 * 1000),
        read: false,
        route: '/profile',
        metadata: {
          userId: 'user-002',
        },
      },

      {
        id: 'notification-003',
        type: NotificationType.Playlist,
        title: 'Added to playlist',
        message: 'Your track was added to a playlist.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false,
        route: '/playlists',
        metadata: {
          playlistId: 'playlist-001',
        },
      },

      {
        id: 'notification-004',
        type: NotificationType.Upload,
        title: 'Upload processed',
        message: 'Your latest upload is now available.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
        route: '/uploads',
        metadata: {
          uploadId: 'upload-001',
        },
      },

      {
        id: 'notification-005',
        type: NotificationType.Message,
        title: 'New message',
        message: 'You have received a new message.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: true,
        route: '/messages',
      },

      {
        id: 'notification-006',
        type: NotificationType.System,
        title: 'Welcome to Gaza Stream',
        message: 'Your account is ready. Start discovering music and artists.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        route: '/home',
      },
    ];

    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    this.notificationsSubject.next(notifications);
  }

  /* ==========================================================
     MARK AS READ
     ========================================================== */

  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            read: true,
          }
        : notification,
    );

    this.notificationsSubject.next(notifications);

    /*
     * When the API is ready:
     *
     * return this.http.patch(
     *   `${this.apiUrl}/${id}/read`,
     *   {}
     * );
     */
  }

  /* ==========================================================
     UNREAD COUNT
     ========================================================== */

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(
      (notification) => !notification.read,
    ).length;
  }

  /* ==========================================================
     CREATE NOTIFICATION
     ========================================================== */

  addNotification(notification: Alert): void {
    const notifications = [notification, ...this.notificationsSubject.value];

    this.notificationsSubject.next(notifications);
  }
}
