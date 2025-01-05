import { Component } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../model/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-events',
  templateUrl: './favorite-events.component.html',
  styleUrl: './favorite-events.component.css'
})
export class FavoriteEventsComponent {
  isButtonDisabled: boolean = false;
  events: Event[] = [];

  isFilterVisible = false;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.init()
  }

  private init(){
    this.eventService.getFavorites().subscribe((events)=>{
      this.events = events;
    });
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    this.isButtonDisabled = this.isFilterVisible;
  }

}
