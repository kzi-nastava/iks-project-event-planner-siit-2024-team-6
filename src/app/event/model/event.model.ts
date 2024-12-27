import { Offer } from '../../offer/model/offer.model';
import { Product } from '../../offer/model/offer.model';
import { EventTypeDTO } from '../event-type.service';
export interface Event {
    id: number;
    name: string;
    description: string;
    place: string;
    maxParticipants: number;
    minParticipants: number;
    isPublic: boolean;
    isDeleted: boolean;
    date: Date;
    photos?: string[];
    activities?: Activity[];
    budget?: Budget;
    categories?: Category[];
    eventType?: EventTypeDTO;
    reservedOffers?: Offer[];
    boughtProducts?: Product[];
  }

  interface Activity {
    name: string;
    description: string;
    location: string;
    time: Date;
  }
  
  interface Budget {
    maxPrices: number;
  }
  
  export interface Category {
    name: string;
    description: string;
  }
  
  export interface OrganizerDTO {
    id: number;
    email: string;
    name: string;
    lastname: string;
    address: string;
    userType: string;
    phoneNumber: string;
    photoUrl: string;
    isActive: boolean;
    suspendedSince: string | null; // Assuming LocalDateTime is converted to ISO string
    favouriteOffers: any[]; // Assuming OfferDTO is defined
    favouriteEvents: any[];
    attends: any[];
    notifications: any[]; // Assuming NotificationDTO is defined
    myEvents: Event[];
  }