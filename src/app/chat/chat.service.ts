import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from './model/chat.model';
import { Observable } from 'rxjs';
import { NewMessageDTO } from '../dto/message-dtos';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
   private apiUrl = 'http://localhost:8080/api/chats';

  constructor(private http: HttpClient) { }

  getChats(): Observable<Chat[]> {
    const token = localStorage.getItem('user'); // Assuming the JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    });

    return this.http.get<Chat[]>(`${this.apiUrl}/`, { headers });
  }
  sendMessage(userId: number, messageDto: NewMessageDTO): Observable<number> {
    const token = localStorage.getItem('user'); // Assuming the JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    });

    return this.http.post<number>(
      `${this.apiUrl}/send/${userId}`,
      messageDto,
      { headers }
    );
  }
}
