import { NotificationType } from "../enums/notification-type-enum";

export interface Alert {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  route?: string;

  metadata?: {
    trackId?: string;
    playlistId?: string;
    userId?: string;
    uploadId?: string;
  };
}
