import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit() {
    this.receiverId = +this.route.snapshot.paramMap.get('id')!;
    const userId = this.authService.getUserId();
    this.chatService.connect(userId);
    this.chatService.messages$.subscribe((msgs) => {
      this.messages = msgs;
    });
    this.loadMessages();
  }
  ngAfterViewInit() {
    this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom(); // Optional, ensures scroll on DOM updates
  }

  scrollToBottom(): void {
    try {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (err) { }
  }

  goBack(): void {
    this.location.back(); // <-- goes to the previous route
  }

  loadMessages() {
    this.chatService.getMessages(this.receiverId).subscribe({
      next: (data) => {
        this.receiver = data.chat;
        this.chatService.setInitialMessages(data.messages);
        setTimeout(() => this.scrollToBottom(), 0);
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
        setTimeout(() => this.scrollToBottom(), 0)
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
