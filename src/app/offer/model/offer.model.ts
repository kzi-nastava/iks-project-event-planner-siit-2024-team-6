import { Category } from "../../event/model/event.model";
import { EventType } from "../../event/model/event.model";

export interface Offer {
  id: number;
  status: string;
  name: string;
  description: string;
  price: number;
  sale?: number;
  photos: string[];
  category: Category;
  isAvailable: boolean;
  isDeleted: boolean;
  lastChanged: Date;
  eventTypes: EventType[];
  type?: 'Service' | 'Product';
}

export interface Product extends Offer {
  type: 'Product';
}

export interface Service extends Offer {
  type: 'Service';
  specifics: string;
  minDuration: number;
  maxDuration: number;
  preciseDuration: number;
  latestReservation: number;
  latestCancelation: number;
  reservations: Reservation[];
}

export interface Reservation {
  isCanceled: boolean;
  reservedAt: Date;
  timeSlot: TimeSlot;
}

export interface TimeSlot {
  time: Date;
  duration: number;
}
