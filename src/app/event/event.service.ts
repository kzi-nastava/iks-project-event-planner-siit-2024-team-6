import { Injectable } from '@angular/core';
import { Event, EventType } from './model/event.model';
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
  

  getAll(pageProperties?: any): Observable<PagedResponse<Event>> {
    let params = new HttpParams();
    if(pageProperties){
      params = params.set('page',pageProperties.page).set('size',pageProperties.pageSize)
    }
    return this.httpClient.get<PagedResponse<Event>>(this.apiUrl+`all-elements`, {params:params});
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
