import { NotificationType } from "../../enums/notification-type.enum";
export interface Notification {
    id: number;
    receiverId: number;
    text: string;
    type: NotificationType;
    timestamp: string;
  }