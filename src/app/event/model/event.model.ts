export interface Event {
    name: string;
    description: string;
    location: string;
    maxParticipants: number;
    minParticipants: number;
    public: boolean;
    disabled: boolean;
    date: Date;
    photo?: string;
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
  
  interface Category {
    name: string;
    description: string;
  }
  
  interface EventType {
    name: string;
    description: string;
    isDisabled: boolean;
  }
  
  interface Offer {
    status: Status;
    price: number;
    description: string;
    isPublic: boolean;
    isDisabled: boolean;
    latestChange: Date;
  }
  
  export enum Status {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
  }
  
  interface Product {
    name: string;
    description: string;
    price: number;
  }