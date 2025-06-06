import { Injectable } from '@angular/core';
import { Offer, Product, ProviderCompany, Service } from './model/offer.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { PagedResponse } from '../shared/model/paged-response.model';
import { NewOfferDTO } from '../dto/offer-dtos';
import { NewBudgetDTO } from '../dto/budget-dtos';
import { NewReactionDTO, ReactionDTO } from '../dto/reaction-dtos';


@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private offerList: Offer[] = [];
  private servicesList: Service[] = [];
  private productsList: Product[] = [];
  private editService: Service = null;
  private editProduct: Product = null;

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
  private apiUrlProvider = environment.apiHost + '/providers/';
  constructor(private httpClient: HttpClient) { }

  getAll(pageProperties?: any): Observable<PagedResponse<Offer>> {
    let params = new HttpParams();
    if (pageProperties) {
      params = params.set('page', pageProperties.page).set('size', pageProperties.pageSize);
    }
    return this.httpClient.get<PagedResponse<Offer>>(this.apiUrl + `all-elements`, { params: params });
  }

  getAllProviderServices(pageProperties?: { page: number; pageSize: number }): Observable<PagedResponse<Service>> {
    let params = new HttpParams();

    if (pageProperties) {
      params = params
        .set('page', pageProperties.page.toString())
        .set('pageSize', pageProperties.pageSize.toString()); // <-- match backend
    }

    // Retrieve the token (assuming it's stored in localStorage)
    const token = localStorage.getItem('user');
    console.log("TOKEN");
    console.log(token);

    // Set the Authorization header with the JWT token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    const url = `${this.apiUrlProvider}my-services`; // Ensure no extra slash
    console.log("Request URL:", url);

    return this.httpClient.get<PagedResponse<Service>>(url, { params, headers }
    );
  }

  addToFavourites(offerId: number): Observable<void> {
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.post<void>(
      `${this.apiUrl}${offerId}/add-favour`, {},
      { headers }
    );
  }

  removeFromFavourites(offerId: number): Observable<void> {
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.post<void>(
      `${this.apiUrl}${offerId}/remove-favour`, {},
      { headers }
    );
  }

  isFavourited(offerId: number): Observable<boolean> {
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<boolean>(
      `${this.apiUrl}${offerId}/is-favourited`, { headers }
    );
  }

  getAllProviderProducts(pageProperties?: { page: number; pageSize: number }): Observable<PagedResponse<Product>> {
    let params = new HttpParams();

    if (pageProperties) {
      params = params
        .set('page', pageProperties.page.toString())
        .set('size', pageProperties.pageSize.toString());
    }

    const url = `${this.apiUrlProvider}my-products`; // Ensure no extra slash

    return this.httpClient.get<PagedResponse<Product>>(url, { params }
    );
  }

  getProviderByOfferId(offerId: number): Observable<ProviderCompany> {
    const url = `${this.apiUrl}${offerId}/provider`;
    return this.httpClient.get<ProviderCompany>(url);
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

  updateService(id: number, offer: NewOfferDTO): Observable<Offer> {
    // Retrieve the token (assuming it's stored in localStorage)
    const token = localStorage.getItem('user');
    console.log("TOKEN");
    console.log(token);

    // Set the Authorization header with the JWT token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    const url = `${this.apiUrlProvider}${id}`; // Ensure no extra slash
    console.log("Request URL:", url);

    return this.httpClient.put<Offer>(url, offer, { headers });
  }

  updateProduct(id: number, offer: NewOfferDTO): Observable<Offer> {
    // Retrieve the token (assuming it's stored in localStorage)

    const url = `${this.apiUrlProvider}${id}`; // Ensure no extra slash
    console.log("Request URL:", url);

    return this.httpClient.put<Offer>(`${url}/product`, offer);
  }
  getServices(): Service[] {
    return this.servicesList;
  }
  getProducts(): Product[] {
    return this.productsList;
  }
  addService(service: Service): void {
    this.servicesList.push(service);
  }

  addProduct(product: Product): void {
    this.productsList.push(product);
  }

  getAllCategories(): Observable<string[]> {
    // Retrieve the token (assuming it's stored in localStorage)
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrlProvider}categories`;

    // Perform the HTTP GET request to retrieve categories
    return this.httpClient.get<string[]>(url, { headers });
  }

  setService(service: Service): void {
    this.editService = service;
  }

  setProduct(product: Product): void {
    this.editProduct = product;
  }

  getService(): Service {
    const x = this.editService;
    this.setService(null);
    return x;
  }

  getProduct(): Product {
    const x = this.editProduct;
    this.setProduct(null);
    return x;
  }

  deleteOffer(offerId: number): Observable<void> {
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrlProvider}${offerId}`;
    return this.httpClient.delete<void>(url, { headers });
  }
  createService(newOffer: NewOfferDTO): Observable<NewOfferDTO> {
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.post<NewOfferDTO>(`${this.apiUrlProvider}`, newOffer, { headers });
  }

  createProduct(newOffer: NewOfferDTO): Observable<NewOfferDTO> {
    return this.httpClient.post<NewOfferDTO>(`${this.apiUrlProvider}product`, newOffer);
  }

  deleteProduct(offerId: number): Observable<void> {
    const url = `${this.apiUrlProvider}${offerId}`;
    return this.httpClient.delete<void>(url);
  }

  searchOffers(name: string, page: number, size: number): Observable<any> {
    const token = localStorage.getItem('user'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams().set('name', name || '').set('page', page).set('size', size);

    return this.httpClient.get<any>(`${this.apiUrlProvider}search`, { headers, params });
  }

  addToFavorites(id: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}${id}/favorite`, {});
  }

  removeFromFavorites(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}${id}/favorite`);
  }
  getFavorites(): Observable<Offer[]> {
    return this.httpClient.get<Offer[]>(`${this.apiUrl}favorites`);
  }
  getFilteredOffers(params: any): Observable<PagedResponse<Offer>> {
    return this.httpClient.get<PagedResponse<Offer>>('/api/offers/search', { params });
  }
  getFilteredProviderServices(params: any): Observable<PagedResponse<Service>> {
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<PagedResponse<Service>>('/api/offers/search-services', { headers, params });
  }

  getFilteredOffersByBudget(budgetDTO: NewBudgetDTO, params: any): Observable<PagedResponse<Offer>> {
    const token = localStorage.getItem('user');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.post<PagedResponse<Offer>>(
      '/api/offers/searchByBudget',
      budgetDTO,
      { headers, params }
    );
  }


  getFilteredFavoriteProducts(params: any): Observable<PagedResponse<Offer>> {
    return this.httpClient.get<PagedResponse<Offer>>('/api/offers/favoriteProducts', { params });
  }
  getFilteredFavoriteServices(params: any): Observable<PagedResponse<Offer>> {
    return this.httpClient.get<PagedResponse<Offer>>('/api/offers/favoriteServices', { params });
  }
  getAllCategoriesNames(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}categories`);
  }

  getFavoriteProducts(pageProperties?: any): Observable<PagedResponse<Offer>> {
    let params = new HttpParams();
    if (pageProperties) {
      params = params.set('page', pageProperties.page).set('size', pageProperties.pageSize);
    }
    return this.httpClient.get<PagedResponse<Offer>>(this.apiUrl + `all-elements`, { params: params });
  }

  buyProduct(productId: number, eventId: number) {
    return this.httpClient.post(`/api/offers/${productId}/buy?eventId=${eventId}`, null);
  }

  addReaction(reaction: NewReactionDTO): Observable<ReactionDTO> {
    const token = localStorage.getItem('user'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.post<ReactionDTO>(
      `/api/reactions/`,
      reaction,
      { headers }
    );
  }

  checkIfPurchased(offerId: number): Observable<boolean> {
    const token = localStorage.getItem('user'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.get<boolean>(`api/offers/${offerId}/purchased`, { headers });
  }
  checkIfReserved(offerId: number): Observable<boolean> {
    const token = localStorage.getItem('user'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.get<boolean>(`api/reservations/${offerId}/reserved`, { headers });
  }

}

