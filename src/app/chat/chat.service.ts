import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, Message } from './model/chat.model';
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
  findByUsers(userId: number) {
    const token = localStorage.getItem('user'); // Assuming the JWT token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    });

    return this.http.post<number>(`${this.apiUrl}/find/${userId}`, {}, { headers });
  }
  getMessages(chatId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${chatId}`);
  }
  sendMessage(chatId: number, message: NewMessageDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/${chatId}/send`, message);
  }
}
