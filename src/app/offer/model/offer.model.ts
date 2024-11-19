import { Category } from "../../event/model/event.model";
import { EventType } from "../../event/model/event.model";

export interface Offer {
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
}

export interface Product extends Offer {
}

export interface Service extends Offer {
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
