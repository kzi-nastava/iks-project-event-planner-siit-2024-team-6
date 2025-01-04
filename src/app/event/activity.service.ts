import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Activity {
  id?: number;
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private baseUrl = '/api/organizers'; // Замените на реальный URL вашего API

  constructor(private http: HttpClient) {}

  getActivities(eventId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/events/${eventId}/agenda`);
  }

  addActivity(eventId: number, activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.baseUrl}/events/${eventId}/activity`, activity);
  }

  updateActivity(eventId: number, activityId: number, activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.baseUrl}/events/${eventId}/activity/${activityId}`, activity);
  }

  deleteActivity(eventId: number, activityId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${eventId}/activity/${activityId}`);
  }
  
  getActivityById(eventId: number, activityId: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.baseUrl}/events/${eventId}/activity/${activityId}`);
  }  

  downloadAgendaPdf(eventId: number): void {
    this.http.get(`${this.baseUrl}/events/${eventId}/getAgendaPDF`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agenda.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
