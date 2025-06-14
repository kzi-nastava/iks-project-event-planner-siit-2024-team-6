import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, ChatWithMessages, Message } from './model/chat.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewMessageDTO } from '../dto/message-dtos';
import { BlockDTO } from '../dto/block-dto';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chats';
  private stompClient!: Client;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

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
  getMessages(chatId: number): Observable<ChatWithMessages> {
    return this.http.get<ChatWithMessages>(`${this.apiUrl}/${chatId}`);
  }
  sendMessage(chatId: number, message: NewMessageDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/${chatId}/send`, message);
  }

  blockUser(blockerId: number, blockedId: number): Observable<BlockDTO> {
  return this.http.post<BlockDTO>(`http://localhost:8080/api/users/${blockerId}/block/${blockedId}`, {});
  }

  getOtherParticipant(chatId: number): Observable<number> {
    return this.http.get<number>(`/api/chats/${chatId}/participant`);
  }


  // ---- WebSocket: Connect to receive messages only ----
  connect(userId: number) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/socket-web'),
      debug: (str) => console.log('STOMP: ' + str),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket connected: ', frame);

      // 👇 Server publishes here — we subscribe to it
      this.stompClient.subscribe(`/socket-publisher/messages/${userId}`, (msg: IMessage) => {
        if (msg.body) {
          const newMsg: Message = JSON.parse(msg.body);
          const currentMessages = this.messagesSubject.getValue();
          this.messagesSubject.next([...currentMessages, newMsg]);
        }
      });
    };

    this.stompClient.activate();
  }


  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  setInitialMessages(messages: Message[]) {
    this.messagesSubject.next(messages);
  }

}
