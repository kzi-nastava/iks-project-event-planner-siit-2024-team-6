import { Component, OnInit } from '@angular/core';
import { Chat, Message } from '../model/chat.model';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewMessageDTO } from '../../dto/message-dtos';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Location } from '@angular/common'

// chat.component.ts
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  newMessage = '';
  receiverId!: number;
  receiver?: Chat;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit() {
    this.receiverId = +this.route.snapshot.paramMap.get('id')!;
    this.loadMessages();
    const userId = this.authService.getUserId();
    this.chatService.connect(userId);
    this.chatService.messages$.subscribe((msgs) => {
      this.messages = msgs;
    });
  }

   goBack(): void {
    this.location.back(); // <-- goes to the previous route
  }

  loadMessages() {
    this.chatService.getMessages(this.receiverId).subscribe({
      next: (data) => {
        this.receiver = data.chat;
        this.messages = data.messages.map(msg => ({
          id: msg.id,
          text: msg.text,
          isFromUser: msg.isFromUser // rename here to match your interface
        }));
        this.messages = data.messages;
        console.log(this.messages);
      },
      error: (err) => {
        this.snackBar.open('Could not load messages.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim().length == 0) {
      return;
    }
    const message: NewMessageDTO = {
      text: this.newMessage
    };
    this.chatService.sendMessage(this.receiverId, message).subscribe({
      next: (messageDto) => {
        this.messages.push(messageDto);  // Optionally update chat view
        this.newMessage = '';
      },
      error: () => {
        this.snackBar.open('Failed to send message.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
  
  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
