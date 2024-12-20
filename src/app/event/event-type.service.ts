import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventTypeDTO {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
  categories: { id: number; name: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class EventTypeService {
  private apiUrl = '/api/admins/event-types';

  constructor(private http: HttpClient) {}

  getAllEventTypes(): Observable<EventTypeDTO[]> {
    return this.http.get<EventTypeDTO[]>(this.apiUrl);
  }

  updateEventType(id: number, data: Partial<EventTypeDTO>): Observable<EventTypeDTO> {
    return this.http.put<EventTypeDTO>(`${this.apiUrl}/${id}`, data);
  }
}
