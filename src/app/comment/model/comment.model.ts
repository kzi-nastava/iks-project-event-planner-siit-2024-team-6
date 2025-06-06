export interface Reaction {
  id: number;
  text: string;
  rating?: number;
  offerId?: number;
  eventId?: number;
  userId: number;
}
