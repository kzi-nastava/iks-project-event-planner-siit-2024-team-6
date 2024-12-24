import { EventType } from "../../event/model/event.model";

export interface OfferDTO {
    name: string;
    description: string;
    price: number;
    sale?: number;
    photos: string[];
    isVisible: boolean;
    isAvailable: boolean;
    isDeleted: boolean;
    category: string;
    categorySuggestion?: string; // Adjust the type based on your frontend needs
    eventTypes: EventType[];
    type: string; // "Product" or "Service"
  
    // Service-specific fields
    specifics?: string;
    minDuration?: number;
    maxDuration?: number;
    preciseDuration?: number;
    latestReservation?: number;
    latestCancelation?: number;
    isReservationAutoApproved: boolean;
  }
  