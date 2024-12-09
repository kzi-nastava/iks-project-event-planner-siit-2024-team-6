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

  private getPagedEntities(){
    this.eventService.getAll(this.pageProperties).subscribe({next: (response: PagedResponse<Event>)=>{
      this.events = response.content;
      this.pageProperties.totalCount = response.totalElements;
    }});
  }
  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  }
}
