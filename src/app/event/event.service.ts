import { Injectable } from '@angular/core';
import { Event, OrganizerDTO, EventType } from './model/event.model';
import { Status } from '../enums/status.enum';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from '../../env/environment';
import {Observable} from 'rxjs';
import {PagedResponse} from '../shared/model/paged-response.model';


@Injectable({
  providedIn: 'root',
})
export class EventService {


  private apiUrl = environment.apiHost+`/events/`; 
  constructor(private httpClient: HttpClient){}
  
  getEventOrganizer(eventId: number): Observable<OrganizerDTO> {
    return this.httpClient.get<OrganizerDTO>(`${this.apiUrl}${eventId}/getOrganizer`);
  }
  getAll(pageProperties?: any): Observable<PagedResponse<Event>> {
    let params = new HttpParams();
    if(pageProperties){
      params = params.set('page',pageProperties.page).set('size',pageProperties.pageSize)
    }
    return this.httpClient.get<PagedResponse<Event>>(this.apiUrl+`all-elements`, {params:params});
  }
  getAllByOrganizer(): Observable<Event[]> {
    return this.httpClient.get<Event[]>("/api/organizers/events");
  }

  createEvent(event: any): Observable<any> {
    return this.httpClient.post("/api/organizers/events", event);
  }

  getTopFive(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.apiUrl+`top-five`);
  }

  getAllNames(): Observable<string[]>{
      return this.httpClient.get<string[]>(this.apiUrl+"event-types");
  }

  getEventTypeByName(name: String): Observable<EventType>{
    return this.httpClient.get<EventType>(`${this.apiUrl}${name}/event-type`);
  }
  
}


// const EVENTS: Event[] = [
//   {
//     name: 'Yoga Retreat',
//     description: 'A peaceful and rejuvenating retreat focusing on yoga, meditation, and mindfulness.',
//     place: 'Mountain Bliss Resort, Aspen, Colorado',
//     maxParticipants: 30,
//     minParticipants: 5,
//     public: true,
//     disabled: false,
//     date: new Date('2024-09-20'),
//     photos: ['https://images.squarespace-cdn.com/content/v1/590e5eff20099e49cdc1048d/1506078288556-5AXBZX4RZ2DCOJ6ECUW0/UBU_660.jpg'],
//     activities: [
//       {
//         name: 'Morning Yoga Session',
//         description: 'Start the day with a revitalizing yoga session led by a certified instructor.',
//         location: 'Open Deck with Mountain View',
//         time: new Date('2024-09-20T07:00:00'),
//       },
//       {
//         name: 'Meditation Workshop',
//         description: 'A guided meditation session to help you relax and find inner peace.',
//         location: 'Zen Garden',
//         time: new Date('2024-09-20T10:00:00'),
//       },
//       {
//         name: 'Mindfulness Hike',
//         description: 'A scenic hike with mindfulness exercises to connect with nature.',
//         location: 'Aspen Trail',
//         time: new Date('2024-09-20T14:00:00'),
//       },
//     ],
//     budget: { maxPrices: 2000 },
//     categories: [
//       {
//         name: 'Wellness',
//         description: 'Events focused on health, wellness, and mindfulness.',
//       },
//       {
//         name: 'Outdoor Activities',
//         description: 'Events involving outdoor and nature-based activities.',
//       },
//     ],
//     eventType: {
//       name: 'Public',
//       description: 'An event open to anyone interested in yoga and mindfulness.',
//       isDisabled: false,
//     },
//     reservedOffers: [
//     ],
//     boughtProducts: [
//     ],
//   },
//   {
//     name: 'Tech Conference',
//     description: 'An annual technology conference featuring top speakers.',
//     place: 'Tech Convention Center, Auditorium A, San Francisco, USA',
//     maxParticipants: 500,
//     minParticipants: 50,
//     public: true,
//     disabled: false,
//     date: new Date('2024-07-10'),
//     photos: ["https://www.thebrewery.co.uk/wp-content/uploads/2020/10/Theatre-style-7.jpg"],
//     activities: [
//       {
//         name: 'Keynote Speech',
//         description: 'Opening keynote by a leading tech innovator.',
//         location: 'Auditorium A',
//         time: new Date('2024-07-10T09:00:00'),
//       },
//       {
//         name: 'Networking Session',
//         description: 'Meet and connect with peers in the industry.',
//         location: 'Networking Hall',
//         time: new Date('2024-07-10T12:00:00'),
//       },
//     ],
//     budget: { maxPrices: 10000 },
//     categories: [
//       {
//         name: 'Technology',
//         description: 'Events focusing on the latest in technology.',
//       },
//     ],
//     eventType: {
//       name: 'Public',
//       description: 'An event open to the general public.',
//       isDisabled: false,
//     },
//     reservedOffers: [
//     ],
//     boughtProducts: [
//     ],
//   },
//   {
//     name: 'Outdoor Concert',
//     description: 'A night of music and fun under the stars.',
//     place: 'Central Park, Open Stage, New York, USA',
//     maxParticipants: 1000,
//     minParticipants: 100,
//     public: true,
//     disabled: false,
//     date: new Date('2024-08-20'),
//     photos: ['https://images.stockcake.com/public/b/1/e/b1efd91e-0c22-4e79-8d5b-6618f8d946ff_large/outdoor-concert-crowd-stockcake.jpg'],
//     activities: [
//       {
//         name: 'Live Band Performance',
//         description: 'Performance by a popular band.',
//         location: 'Main Stage',
//         time: new Date('2024-08-20T19:00:00'),
//       },
//       {
//         name: 'Food Stalls',
//         description: 'Snacks and drinks available for attendees.',
//         location: 'Food Court',
//         time: new Date('2024-08-20T18:00:00'),
//       },
//     ],
//     budget: { maxPrices: 15000 },
//     categories: [
//       {
//         name: 'Music',
//         description: 'Events focused on live music and performances.',
//       },
//     ],
//     eventType: {
//       name: 'Public',
//       description: 'An event open to the general public.',
//       isDisabled: false,
//     },
//     reservedOffers: [
//     ],
//     boughtProducts: [
//     ],
//   },
//   {
//     name: 'Birthday Party',
//     description: 'A fun-filled birthday celebration with friends and family.',
//     place: 'Event Hall "Celebrations", Main Street 123, Belgrade, Serbia',
//     maxParticipants: 50,
//     minParticipants: 10,
//     public: true,
//     disabled: false,
//     date: new Date('2024-06-15'),
//     photos: ['https://img.freepik.com/premium-photo/friends-celebrating-birthday-party_1280275-114523.jpg'],
//     activities: [
//       {
//         name: 'Cake Cutting',
//         description: 'Cutting the birthday cake with family and friends.',
//         location: 'Main Hall',
//         time: new Date('2024-06-15T14:00:00'),
//       },
//       {
//         name: 'Party Games',
//         description: 'Fun games for everyone to enjoy.',
//         location: 'Garden Area',
//         time: new Date('2024-06-15T15:00:00'),
//       },
//     ],
//     budget: { maxPrices: 500 },
//     categories: [
//       {
//         name: 'Celebration',
//         description: 'Events that celebrate special moments.',
//       },
//     ],
//     eventType: {
//       name: 'Private',
//       description: 'A private event for close friends and family.',
//       isDisabled: false,
//     },
//     reservedOffers: [
//     ],
//     boughtProducts: [
//     ],
//   },
//   {
//     name: 'Painting Workshop: Mastering Watercolors',
//     description: 'A creative workshop to explore the art of watercolor painting with expert guidance.',
//     place: 'Art Studio, Downtown Chicago, Illinois',
//     maxParticipants: 20,
//     minParticipants: 5,
//     public: true,
//     disabled: false,
//     date: new Date('2024-11-25'),
//     photos: ['https://images.squarespace-cdn.com/content/v1/5804f37703596e417ce39f7f/7c4f36cb-2106-42c2-83ee-c2fbfb7a9460/Adult+abstract+art+painting+class+Brighton+UK.jpg'],
//     activities: [
//       {
//         name: 'Introduction to Watercolors',
//         description: 'Learn about watercolor techniques, tools, and materials.',
//         location: 'Art Studio - Main Hall',
//         time: new Date('2024-11-25T10:00:00'),
//       },
//       {
//         name: 'Hands-On Painting Session',
//         description: 'Practice and create your own watercolor painting with guidance from an expert.',
//         location: 'Art Studio - Painting Area',
//         time: new Date('2024-11-25T11:30:00'),
//       },
//       {
//         name: 'Art Exhibition & Feedback',
//         description: 'Showcase your work and receive constructive feedback from peers and the instructor.',
//         location: 'Art Studio - Gallery Room',
//         time: new Date('2024-11-25T14:00:00'),
//       },
//     ],
//     budget: { maxPrices: 1500 },
//     categories: [
//       {
//         name: 'Art',
//         description: 'Events focused on artistic expression and creativity.',
//       },
//       {
//         name: 'Education',
//         description: 'Workshops aimed at teaching new skills and techniques.',
//       },
//     ],
//     eventType: {
//       name: 'Public',
//       description: 'An event open to all art enthusiasts, from beginners to professionals.',
//       isDisabled: false,
//     },
//     reservedOffers: [
//     ],
//     boughtProducts: [
//     ],
//   },
  

// ];

  getEventById(id: number): Observable<Event> {
    return this.httpClient.get<Event>(`${this.apiUrl}${id}`);
  }

  updateEvent(event: any): Observable<any> {
    return this.httpClient.put(`/api/organizers/events/${event.id}`, event);
  }
  deleteEvent(id: number): Observable<any> {
    return this.httpClient.delete(`/api/organizers/events/${id}`);
  }
}
