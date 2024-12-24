import { Offer } from '../../offer/model/offer.model';
import { Product } from '../../offer/model/offer.model';
import { EventTypeDTO } from '../event-type.service';
export interface Event {
    name: string;
    description: string;
    place: string;
    maxParticipants: number;
    minParticipants: number;
    isPublic: boolean;
    disabled: boolean;
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
  