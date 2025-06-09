import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from './model/chat.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
   private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) { }

  getChats(): Observable<Chat[]> {
    const token = localStorage.getItem('user'); // Assuming the JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    });

    return this.http.get<Chat[]>(`${this.apiUrl}/chats`, { headers });
  }
}
