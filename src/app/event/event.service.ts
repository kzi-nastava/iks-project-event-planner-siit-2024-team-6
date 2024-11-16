import { Injectable } from '@angular/core';
import { Event } from './model/event.model'; // Adjust the path based on your project structure
import { Status } from './model/event.model';
const EVENTS: Event[] = [
  {
    name: 'Yoga Retreat',
    description: 'A peaceful and rejuvenating retreat focusing on yoga, meditation, and mindfulness.',
    location: 'Mountain Bliss Resort, Aspen, Colorado',
    maxParticipants: 30,
    minParticipants: 5,
    public: true,
    disabled: false,
    date: new Date('2024-09-20'),
    photo: 'https://images.squarespace-cdn.com/content/v1/590e5eff20099e49cdc1048d/1506078288556-5AXBZX4RZ2DCOJ6ECUW0/UBU_660.jpg',
    activities: [
      {
        name: 'Morning Yoga Session',
        description: 'Start the day with a revitalizing yoga session led by a certified instructor.',
        location: 'Open Deck with Mountain View',
        time: new Date('2024-09-20T07:00:00'),
      },
      {
        name: 'Meditation Workshop',
        description: 'A guided meditation session to help you relax and find inner peace.',
        location: 'Zen Garden',
        time: new Date('2024-09-20T10:00:00'),
      },
      {
        name: 'Mindfulness Hike',
        description: 'A scenic hike with mindfulness exercises to connect with nature.',
        location: 'Aspen Trail',
        time: new Date('2024-09-20T14:00:00'),
      },
    ],
    budget: { maxPrices: 2000 },
    categories: [
      {
        name: 'Wellness',
        description: 'Events focused on health, wellness, and mindfulness.',
      },
      {
        name: 'Outdoor Activities',
        description: 'Events involving outdoor and nature-based activities.',
      },
    ],
    eventType: {
      name: 'Public',
      description: 'An event open to anyone interested in yoga and mindfulness.',
      isDisabled: false,
    },
    reservedOffers: [
      {
        status: Status.PENDING,
        price: 1000,
        description: 'Catering services with healthy meals and beverages.',
        isPublic: true,
        isDisabled: false,
        latestChange: new Date('2024-09-01'),
      },
    ],
    boughtProducts: [
      {
        name: 'Yoga Mats',
        description: 'High-quality yoga mats for participants.',
        price: 500,
      },
      {
        name: 'Wellness Kits',
        description: 'Gift kits with essential oils, candles, and mindfulness guides.',
        price: 300,
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
    photo: "https://www.thebrewery.co.uk/wp-content/uploads/2020/10/Theatre-style-7.jpg",
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
    photo: 'https://images.stockcake.com/public/b/1/e/b1efd91e-0c22-4e79-8d5b-6618f8d946ff_large/outdoor-concert-crowd-stockcake.jpg',
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
  {
    name: 'Birthday Party',
    description: 'A fun-filled birthday celebration with friends and family.',
    location: 'Event Hall "Celebrations", Main Street 123, Belgrade, Serbia',
    maxParticipants: 50,
    minParticipants: 10,
    public: true,
    disabled: false,
    date: new Date('2024-06-15'),
    photo: 'https://img.freepik.com/premium-photo/friends-celebrating-birthday-party_1280275-114523.jpg',
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
    name: 'Painting Workshop: Mastering Watercolors',
    description: 'A creative workshop to explore the art of watercolor painting with expert guidance.',
    location: 'Art Studio, Downtown Chicago, Illinois',
    maxParticipants: 20,
    minParticipants: 5,
    public: true,
    disabled: false,
    date: new Date('2024-11-25'),
    photo: 'https://images.squarespace-cdn.com/content/v1/5804f37703596e417ce39f7f/7c4f36cb-2106-42c2-83ee-c2fbfb7a9460/Adult+abstract+art+painting+class+Brighton+UK.jpg',
    activities: [
      {
        name: 'Introduction to Watercolors',
        description: 'Learn about watercolor techniques, tools, and materials.',
        location: 'Art Studio - Main Hall',
        time: new Date('2024-11-25T10:00:00'),
      },
      {
        name: 'Hands-On Painting Session',
        description: 'Practice and create your own watercolor painting with guidance from an expert.',
        location: 'Art Studio - Painting Area',
        time: new Date('2024-11-25T11:30:00'),
      },
      {
        name: 'Art Exhibition & Feedback',
        description: 'Showcase your work and receive constructive feedback from peers and the instructor.',
        location: 'Art Studio - Gallery Room',
        time: new Date('2024-11-25T14:00:00'),
      },
    ],
    budget: { maxPrices: 1500 },
    categories: [
      {
        name: 'Art',
        description: 'Events focused on artistic expression and creativity.',
      },
      {
        name: 'Education',
        description: 'Workshops aimed at teaching new skills and techniques.',
      },
    ],
    eventType: {
      name: 'Public',
      description: 'An event open to all art enthusiasts, from beginners to professionals.',
      isDisabled: false,
    },
    reservedOffers: [
      {
        status: Status.ACCEPTED,
        price: 1000,
        description: 'Studio rental and painting supplies.',
        isPublic: true,
        isDisabled: false,
        latestChange: new Date('2024-11-10'),
      },
    ],
    boughtProducts: [
      {
        name: 'Watercolor Kits',
        description: 'Kits containing brushes, paints, and paper for participants.',
        price: 500,
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
