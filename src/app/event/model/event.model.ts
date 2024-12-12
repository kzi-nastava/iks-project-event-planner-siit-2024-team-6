import { Offer } from '../../offer/model/offer.model';
import { Product } from '../../offer/model/offer.model';
export interface Event {
    name: string;
    description: string;
    place: string;
    maxParticipants: number;
    minParticipants: number;
    public: boolean;
    disabled: boolean;
    date: Date;
    photos?: string[];
    activities?: Activity[];
    budget?: Budget;
    categories?: Category[];
    eventType?: EventType;
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
  
  export interface EventType {
    name: string;
    description: string;
    isDisabled: boolean;
  }
  
  