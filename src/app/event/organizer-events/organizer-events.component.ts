import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../model/event.model';
import { PageEvent } from '@angular/material/paginator';
import {PagedResponse} from '../../shared/model/paged-response.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-organizer-events',
  templateUrl: './organizer-events.component.html',
  styleUrl: './organizer-events.component.css'
})
export class OrganizerEventsComponent implements OnInit {
  
  events: Event[] = [];

  isFilterVisible = false;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.init()
  }


  private init(){
    this.eventService.getAllByOrganizer().subscribe((events)=>{
      this.events = events;
    });
  }

  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  navigateToOrganizerPage(id: number) {
    this.router.navigate([`/event/${id}/organizer-page`]);
  }
}