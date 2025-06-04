import { EventTypeDTO } from "../../event/event-type.service";

export interface Offer {
  id: number;
  status: string;
  name: string;
  description: string;
  price: number;
  sale?: number;
  photos: string[];
  category: string;
  isAvailable: boolean;
  isDeleted: boolean;
  isVisible: boolean;
  lastChanged: Date;
  eventTypes: EventTypeDTO[];
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
  isReservationAutoApproved: boolean;
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

export interface ProviderCompany{
  id: number;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  description: string;
  companyPhotos: string[];
  openingTime: string;
  closingTime: string;
}