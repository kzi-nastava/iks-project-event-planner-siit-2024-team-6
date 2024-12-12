import { Injectable } from '@angular/core';
import { Offer, Product, Service } from './model/offer.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { PagedResponse } from '../shared/model/paged-response.model';
const SERVICES: Service[] = [
  {
    status: 'AVAILABLE',
    name: 'Event Decoration Service',
    description: 'Professional decoration service for weddings, parties, and more.',
    price: 500,
    photos: ['https://static.wixstatic.com/media/cd8c84_2b2a5e93744a46678743bb950173ad63~mv2.jpg/v1/fill/w_1792,h_960,al_c/cd8c84_2b2a5e93744a46678743bb950173ad63~mv2.jpg'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-02-15'),
    eventTypes: [],
    category: { name: 'Decoration', description: 'Birthday and wedding decoration' },
    minDuration: 120,
    maxDuration: 480,
    preciseDuration: 240,
    latestReservation: 60,
    latestCancelation: 24,
    reservations: [
      {
        isCanceled: false,
        reservedAt: new Date('2024-03-01'),
        timeSlot: { time: new Date('2024-03-15T10:00:00'), duration: 240 },
      },
    ],
  } as Service,
  {
    status: 'AVAILABLE',
    name: 'Photography Service',
    description: 'Capture your special moments with our professional photography service.',
    price: 250,
    photos: ['https://www.indiafilings.com/learn/wp-content/uploads/2017/07/GST-Rate-for-Photography-Services.jpg'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-03-10'),
    eventTypes: [],
    category: { name: 'Photography', description: 'Event photography services' },
    minDuration: 60,
    maxDuration: 360,
    preciseDuration: 180,
    latestReservation: 48,
    latestCancelation: 12,
    reservations: [],
  } as Service,
  {
    status: 'AVAILABLE',
    name: 'Catering Service',
    description: 'Delicious catering for events, including appetizers, main courses, and desserts.',
    price: 1200,
    sale: 1000,
    photos: ['https://www.randstad.cl/s3fs-media/cl/public/styles/blog_article/public/migration/blog_page/images/blog_image_5A58832C-CE41-4678-B855-8425FA675F6C.jpeg?itok=6AxHwI2D'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-04-01'),
    eventTypes: [],
    category: { name: 'Food', description: 'Event catering services' },
    minDuration: 240,
    maxDuration: 720,
    preciseDuration: 480,
    latestReservation: 72,
    latestCancelation: 48,
    reservations: [],
  } as Service,
  {
    status: 'AVAILABLE',
    name: 'Wedding Filming',
    description: 'Capture your special moments with our professional photography service.',
    price: 300,
    photos: ['https://www.indiafilings.com/learn/wp-content/uploads/2017/07/GST-Rate-for-Photography-Services.jpg'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-03-10'),
    eventTypes: [],
    category: { name: 'Photography', description: 'Event photography services' },
    minDuration: 60,
    maxDuration: 360,
    preciseDuration: 180,
    latestReservation: 48,
    latestCancelation: 12,
    reservations: [],
  } as Service,
  {
    status: 'AVAILABLE',
    name: 'Luna Sweets',
    description: 'Delicious catering for events, including appetizers, main courses, and desserts.',
    price: 1200,
    sale: 160,
    photos: ['https://www.randstad.cl/s3fs-media/cl/public/styles/blog_article/public/migration/blog_page/images/blog_image_5A58832C-CE41-4678-B855-8425FA675F6C.jpeg?itok=6AxHwI2D'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-04-01'),
    eventTypes: [],
    category: { name: 'Food', description: 'Event catering services' },
    minDuration: 240,
    maxDuration: 720,
    preciseDuration: 480,
    latestReservation: 72,
    latestCancelation: 48,
    reservations: [],
  } as Service
]

const OFFERS: (Product | Service)[] = [
  // Products
  {
    status: 'AVAILABLE',
    name: 'Pizza Margherita',
    description: 'Delicious stone-baked pizza with fresh mozzarella, basil, and tomato sauce.',
    price: 12.99,
    sale: 8.99,
    photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Supreme_pizza.jpg/1200px-Supreme_pizza.jpg'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-01-01'),
    eventTypes: [],
    category: { name: 'Food', description: 'Delicious meals and snacks' },
  } as Product,
  {
    status: 'AVAILABLE',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise-canceling features and deep bass.',
    price: 149.99,
    sale: 129.99,
    photos: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQTQ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1687660671363'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-01-15'),
    eventTypes: [],
    category: { name: 'Electronics', description: 'Gadgets and tech accessories' },
  } as Product,
  {
    status: 'AVAILABLE',
    name: 'Custom Mug',
    description: 'Personalized ceramic mug with your design or text printed on it.',
    price: 15.99,
    photos: ['https://cms.cloudinary.vpsvc.com/images/c_scale,dpr_auto,f_auto,q_auto:best,t_productPageHeroGalleryTransformation_v2,w_auto/legacy_dam/en-us/S001683929/NPIB-8347-Mugs-Lifestyle-Callouts-Business-Consumer-PDP-Hero-001?cb=21b1a464ee1896c60a41e5b29e152e769309c0d7'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-01-20'),
    eventTypes: [],
    category: { name: 'Gifts', description: 'Personalized gift items' },
  } as Product,

  // Services
  {
    status: 'AVAILABLE',
    name: 'Event Decoration Service',
    description: 'Professional decoration service for weddings, parties, and more.',
    price: 500,
    photos: ['https://static.wixstatic.com/media/cd8c84_2b2a5e93744a46678743bb950173ad63~mv2.jpg/v1/fill/w_1792,h_960,al_c/cd8c84_2b2a5e93744a46678743bb950173ad63~mv2.jpg'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-02-15'),
    eventTypes: [],
    category: { name: 'Decoration', description: 'Birthday and wedding decoration' },
    minDuration: 120,
    maxDuration: 480,
    preciseDuration: 240,
    latestReservation: 60,
    latestCancelation: 24,
    reservations: [
      {
        isCanceled: false,
        reservedAt: new Date('2024-03-01'),
        timeSlot: { time: new Date('2024-03-15T10:00:00'), duration: 240 },
      },
    ],
  } as Service,
  {
    status: 'AVAILABLE',
    name: 'Photography Service',
    description: 'Capture your special moments with our professional photography service.',
    price: 250,
    photos: ['https://www.indiafilings.com/learn/wp-content/uploads/2017/07/GST-Rate-for-Photography-Services.jpg'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-03-10'),
    eventTypes: [],
    category: { name: 'Photography', description: 'Event photography services' },
    minDuration: 60,
    maxDuration: 360,
    preciseDuration: 180,
    latestReservation: 48,
    latestCancelation: 12,
    reservations: [],
  } as Service,
  {
    status: 'AVAILABLE',
    name: 'Catering Service',
    description: 'Delicious catering for events, including appetizers, main courses, and desserts.',
    price: 1200,
    sale: 1000,
    photos: ['https://www.randstad.cl/s3fs-media/cl/public/styles/blog_article/public/migration/blog_page/images/blog_image_5A58832C-CE41-4678-B855-8425FA675F6C.jpeg?itok=6AxHwI2D'],
    isAvailable: true,
    isDeleted: false,
    lastChanged: new Date('2024-04-01'),
    eventTypes: [],
    category: { name: 'Food', description: 'Event catering services' },
    minDuration: 240,
    maxDuration: 720,
    preciseDuration: 480,
    latestReservation: 72,
    latestCancelation: 48,
    reservations: [],
  } as Service
];


@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private offerList: Offer[] = [];
  private servicesList: Service[] = [...SERVICES];

  /*constructor() {
    for (let offerObj of OFFERS) {
      const offer: Offer = {
        status: offerObj.status,
        name: offerObj.name,
        description: offerObj.description,
        price: offerObj.price,
        sale: offerObj.sale,
        photos: offerObj.photos || ['https://via.placeholder.com/300x200'],
        isAvailable: offerObj.isAvailable,
        isDeleted: offerObj.isDeleted,
        lastChanged: new Date(offerObj.lastChanged),
        eventTypes: offerObj.eventTypes || [],
        ...(offerObj as Product).category && { category: (offerObj as Product).category },
        ...(offerObj as Service).specifics && {
          specifics: (offerObj as Service).specifics,
          minDuration: (offerObj as Service).minDuration,
          maxDuration: (offerObj as Service).maxDuration,
          preciseDuration: (offerObj as Service).preciseDuration,
          latestReservation: (offerObj as Service).latestReservation,
          latestCancelation: (offerObj as Service).latestCancelation,
          reservations: (offerObj as Service).reservations || [],
        },
      };
      this.offerList.push(offer);
    }
  }*/

  private apiUrl = environment.apiHost + `/offers/`;
  private providerApiUrl = environment.apiHost+'/providers/';

  constructor(private httpClient: HttpClient) {}

  getAll(pageProperties?: any): Observable<PagedResponse<Offer>> {
    let params = new HttpParams();
    if (pageProperties) {
      params = params.set('page', pageProperties.page).set('size', pageProperties.pageSize);
    }
    return this.httpClient.get<PagedResponse<Offer>>(this.apiUrl + `all-elements`, { params: params });
  }

  getAllProviderServices(providerId: number, pageProperties?: any): Observable<PagedResponse<Service>>{
    let params = new HttpParams();
    if (pageProperties) {
      params = params.set('page', pageProperties.page).set('size', pageProperties.pageSize);
    }
    return this.httpClient.get<PagedResponse<Service>>(this.apiUrl+providerId + `/my-services`, { params: params });
  }

  getTopFive(): Observable<Offer[]> {
    return this.httpClient.get<Offer[]>(this.apiUrl + `top-five`);
  }

  getById(id: number): Observable<Offer> {
    return this.httpClient.get<Offer>(`${this.apiUrl}${id}`);
  }

  createOffer(offer: Offer): Observable<Offer> {
    return this.httpClient.post<Offer>(this.apiUrl, offer);
  }

  updateOffer(id: number, offer: Offer): Observable<Offer> {
    return this.httpClient.put<Offer>(`${this.apiUrl}${id}`, offer);
  }

  deleteOffer(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}${id}`);
  }

  getServices(): Service[] {
    return this.servicesList;
  }
  
  addService(service: Service): void{
    this.servicesList.push(service);
  }

  private serviceData: Offer;

  setService(service: Offer): void {
    this.serviceData = service;
  }

  getService(): Offer {
    return this.serviceData;
  }


  
}
