import { Injectable } from '@angular/core';
import { Event } from './model/event.model'; // Adjust the path based on your project structure
import { Status } from './model/event.model';

const EVENTS: Event[] = [
  {
    name: 'Birthday Party',
    description: 'A fun-filled birthday celebration with friends and family.',
    location: 'Event Hall "Celebrations", Main Street 123, Belgrade, Serbia',
    maxParticipants: 50,
    minParticipants: 10,
    public: true,
    disabled: false,
    date: new Date('2024-06-15'),
    activities: [
      {
        name: 'Cake Cutting',
        description: 'Cutting the birthday cake with family and friends.',
        location: 'Main Hall',
        time: new Date('2024-06-15T14:00:00'),
      },
      {
        name: 'Party Games',
        description: 'Fun games for everyone to enjoy.',
        location: 'Garden Area',
        time: new Date('2024-06-15T15:00:00'),
      },
    ],
    budget: { maxPrices: 500 },
    categories: [
      {
        name: 'Celebration',
        description: 'Events that celebrate special moments.',
      },
    ],
    eventType: {
      name: 'Private',
      description: 'A private event for close friends and family.',
      isDisabled: false,
    },
    reservedOffers: [
      {
        status: Status.ACCEPTED,
        price: 300,
        description: 'Catering services for the party.',
        isPublic: true,
        isDisabled: false,
        latestChange: new Date('2024-06-01'),
      },
    ],
    boughtProducts: [
      {
        name: 'Birthday Cake',
        description: 'A delicious chocolate cake for the celebration.',
        price: 50,
      },
    ],
  },
  {
    name: 'Tech Conference',
    description: 'An annual technology conference featuring top speakers.',
    location: 'Tech Convention Center, Auditorium A, San Francisco, USA',
    maxParticipants: 500,
    minParticipants: 50,
    public: true,
    disabled: false,
    date: new Date('2024-07-10'),
    activities: [
      {
        name: 'Keynote Speech',
        description: 'Opening keynote by a leading tech innovator.',
        location: 'Auditorium A',
        time: new Date('2024-07-10T09:00:00'),
      },
      {
        name: 'Networking Session',
        description: 'Meet and connect with peers in the industry.',
        location: 'Networking Hall',
        time: new Date('2024-07-10T12:00:00'),
      },
    ],
    budget: { maxPrices: 10000 },
    categories: [
      {
        name: 'Technology',
        description: 'Events focusing on the latest in technology.',
      },
    ],
    eventType: {
      name: 'Public',
      description: 'An event open to the general public.',
      isDisabled: false,
    },
    reservedOffers: [
      {
        status: Status.PENDING,
        price: 2000,
        description: 'Hall rental for the conference.',
        isPublic: true,
        isDisabled: false,
        latestChange: new Date('2024-06-20'),
      },
    ],
    boughtProducts: [
      {
        name: 'Conference Materials',
        description: 'Brochures and handouts for attendees.',
        price: 500,
      },
    ],
  },
  {
    name: 'Outdoor Concert',
    description: 'A night of music and fun under the stars.',
    location: 'Central Park, Open Stage, New York, USA',
    maxParticipants: 1000,
    minParticipants: 100,
    public: true,
    disabled: false,
    date: new Date('2024-08-20'),
    activities: [
      {
        name: 'Live Band Performance',
        description: 'Performance by a popular band.',
        location: 'Main Stage',
        time: new Date('2024-08-20T19:00:00'),
      },
      {
        name: 'Food Stalls',
        description: 'Snacks and drinks available for attendees.',
        location: 'Food Court',
        time: new Date('2024-08-20T18:00:00'),
      },
    ],
    budget: { maxPrices: 15000 },
    categories: [
      {
        name: 'Music',
        description: 'Events focused on live music and performances.',
      },
    ],
    eventType: {
      name: 'Public',
      description: 'An event open to the general public.',
      isDisabled: false,
    },
    reservedOffers: [
      {
        status: Status.ACCEPTED,
        price: 5000,
        description: 'Stage setup and sound system rental.',
        isPublic: true,
        isDisabled: false,
        latestChange: new Date('2024-07-15'),
      },
    ],
    boughtProducts: [
      {
        name: 'Concert Tickets',
        description: 'Tickets for attendees.',
        price: 20,
      },
    ],
  },
  {name: 'Birthday Party',
    description: 'A fun-filled birthday celebration with friends and family.',
    location: 'Event Hall "Celebrations", Main Street 123, Belgrade, Serbia',
    maxParticipants: 50,
    minParticipants: 10,
    public: true,
    disabled: false,
    date: new Date('2024-06-15'),
    activities: [
      {
        name: 'Cake Cutting',
        description: 'Cutting the birthday cake with family and friends.',
        location: 'Main Hall',
        time: new Date('2024-06-15T14:00:00'),
      },
      {
        name: 'Party Games',
        description: 'Fun games for everyone to enjoy.',
        location: 'Garden Area',
        time: new Date('2024-06-15T15:00:00'),
      },
    ],
    budget: { maxPrices: 500 },
    categories: [
      {
        name: 'Celebration',
        description: 'Events that celebrate special moments.',
      },
    ],
    eventType: {
      name: 'Private',
      description: 'A private event for close friends and family.',
      isDisabled: false,
    },
    reservedOffers: [
      {
        status: Status.ACCEPTED,
        price: 300,
        description: 'Catering services for the party.',
        isPublic: true,
        isDisabled: false,
        latestChange: new Date('2024-06-01'),
      },
    ],
    boughtProducts: [
      {
        name: 'Birthday Cake',
        description: 'A delicious chocolate cake for the celebration.',
        price: 50,
      },
    ],
  },
];




@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventList: Event[] = [];

  constructor() {
    for (let eventObj of EVENTS) {
      const event: Event = {
        name: eventObj.name,
        description: eventObj.description,
        location: eventObj.location,
        maxParticipants: eventObj.maxParticipants,
        minParticipants: eventObj.minParticipants,
        public: eventObj.public,
        disabled: eventObj.disabled,
        date: new Date(eventObj.date),
        photo: eventObj.photo || 'https://via.placeholder.com/300x200',
        activities: eventObj.activities || [],
        budget: eventObj.budget || { maxPrices: 0 },
        categories: eventObj.categories || [],
        eventType: eventObj.eventType || { name: 'General', description: 'General event type', isDisabled: false },
        reservedOffers: eventObj.reservedOffers || [],
        boughtProducts: eventObj.boughtProducts || [],
      };
      this.eventList.push(event);
    }
  }  

  getAll(): Event[] {
    return this.eventList;
  }

  add(event: Event): void {
    this.eventList.push(event);
  }
}
