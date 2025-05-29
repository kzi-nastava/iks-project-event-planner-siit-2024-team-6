import { Component, Input } from '@angular/core';
import {Event} from '../model/event.model';
import { EventService } from '../event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event!: Event;
  @Input() context: 'organizer' | 'default' = 'default';

  constructor(private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router){}

  manageFavorites(id: number) {
    this.eventService.getFavorites().subscribe((favorites) => {
      const isFavorite = favorites.some(event => event.id === id);
  
      if (isFavorite) {
        this.eventService.removeFromFavorites(id).subscribe(() => {
          this.snackBar.open(`Event ${this.event.name} removed from favorites`, 'Close', {
            duration: 3000,
          });
        });
      } else {
        this.eventService.addToFavorites(id).subscribe(() => {
          this.snackBar.open(`Event ${this.event.name} added to favorites`, 'Close', {
            duration: 3000,
          });
        });
      }
    });
  }
  toEventPage(id: number) {
        if (this.context === 'organizer') {
      this.router.navigate([`/event/${id}/organizer-page`]);
    } else {
      this.router.navigate([`event/${id}`]);
    }
  }
}


