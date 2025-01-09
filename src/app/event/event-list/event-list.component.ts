import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../model/event.model';
import { PageEvent } from '@angular/material/paginator';
import {PagedResponse} from '../../shared/model/paged-response.model';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  
  events: Event[] = [];
  filters: any = {};
  pageProperties = {
    page: 0,
    pageSize: 8,
    totalCount: 0,
    pageSizeOptions: [4, 8, 12]
 };

  isFilterVisible = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getPagedEntities()
  }

  pageChanged(pageEvent: PageEvent){
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }

  /* private getPagedEntities(){
    this.eventService.getAll(this.pageProperties).subscribe({next: (response: PagedResponse<Event>)=>{
      this.events = response.content;
      this.pageProperties.totalCount = response.totalElements;
    }});
  } */


  private getPagedEntities() {
    const params = {
      ...this.pageProperties,
      ...this.filters,
    };
    console.log("Get paged entities called");
    console.log(this.filters);

    this.eventService.getFilteredEvents(params).subscribe({
      next: (response: PagedResponse<Event>) => {
        this.events = response.content;
        this.pageProperties.totalCount = response.totalElements;
        console.log('Paged and filtered events:', response);
      },
      error: (error) => {
        console.error('Error fetching paged entities:', error);
      },
    });
  }
  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  onFiltersApplied(filters: any) {
    console.log('Received filters:', filters);
    this.filters = filters;
    this.pageProperties.page = 0;
    this.getPagedEntities();
  }


}
