import { NewCategoryDTO } from "./category-dtos";
import { NewEventTypeDTO } from "./event-type-dtos";

export interface NewOfferDTO {
    name: string;
    description: string;
    price: number;
    sale?: number;
    photos: string[];
    isVisible: boolean;
    isAvailable: boolean;
    isDeleted: boolean;
    category: string;
    categorySuggestion?: NewCategoryDTO; // Adjust the type based on your frontend needs
    eventTypes: NewEventTypeDTO[];
    type: string; // "Product" or "Service"
  
    // Service-specific fields
    specifics?: string;
    minDuration?: number;
    maxDuration?: number;
    preciseDuration?: number;
    latestReservation?: number;
    latestCancelation?: number;
    isReservationAutoApproved?: boolean;
  }
  export interface NewProductDTO {
    name: string;
    description: string;
    price: number;
    sale?: number;
    photos: string[];
    isVisible: boolean;
    isAvailable: boolean;
    isDeleted: boolean;
    category: string;
    categorySuggestion?: NewCategoryDTO; // Adjust the type based on your frontend needs
    eventTypes: NewEventTypeDTO[];
  }