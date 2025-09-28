import { Component } from '@angular/core';
import { Chat } from '../model/chat.model';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages-center',
  templateUrl: './messages-center.component.html',
  styleUrl: './messages-center.component.css'
})
export class MessagesCenterComponent {
  chatPartners: Chat[] = [];
  private reloadSub?: Subscription;

  constructor(private chatService: ChatService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.loadChats();

    this.reloadSub = this.chatService.reloadChats$.subscribe(() => {
      this.loadChats();
    });
  }

  ngOnDestroy(): void {
    this.reloadSub?.unsubscribe();
  }

  loadChats() {
    this.chatService.getChats().subscribe({
      next: (users) => this.chatPartners = users,
      error: (err) => console.error('Failed to load chat partners', err)
    });
  }

  goBack(): void {
    this.location.back(); // <-- goes to the previous route
  }

  openChat(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }
}
