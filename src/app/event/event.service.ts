import { Injectable } from '@angular/core';
import { Event, OrganizerDTO } from './model/event.model';
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

  getEventById(id: number): Observable<Event> {
    return this.httpClient.get<Event>(`${this.apiUrl}${id}`);
  }

}
