export interface NewReactionDTO {
    offerId?: number;
    eventId?: number;
    text?: string;
    rating?: number;
}

export interface ReactionDTO {
    id: number;
    offerId?: number;
    eventId?: number;
    text?: string;
    rating?: number;
    userName: string;
}