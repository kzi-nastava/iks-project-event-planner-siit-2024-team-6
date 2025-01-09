import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../model/event.model';
import { PageEvent } from '@angular/material/paginator';
import {PagedResponse} from '../../shared/model/paged-response.model';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  
  events: Event[] = [];
  filters: any = {};
  searchQuery: string = '';
  pageProperties = {
    page: 0,
    pageSize: 8,
    totalCount: 0,
    pageSizeOptions: [4, 8, 12]
 };
 @ViewChild(MatPaginator) paginator: MatPaginator;


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
    console.log("Page ",this.pageProperties.page);
    const params = {
      ...this.pageProperties,
      ...this.filters,
    };
    console.log("Get paged entities called");
    console.log(this.filters);

    this.eventService.getFilteredEvents(params).subscribe({
      next: (response: PagedResponse<Event> | null) => {
        if (response && response.content) {
          this.events = response.content;
          this.pageProperties.totalCount = response.totalElements;
          console.log('Paged and filtered events:', response);
        } else {
          this.events = [];
          this.pageProperties.totalCount = 0;
          console.warn('No events found or response is null');
        }
      },
      error: (error) => {
        console.error('Error fetching paged entities:', error);
        this.events = [];
        this.pageProperties.totalCount = 0;
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
    this.paginator.firstPage();
    this.getPagedEntities();
  }

  onSearch() {
    this.filters = {
      name: this.searchQuery,
      description: this.searchQuery,
      place: this.searchQuery,
    };
    this.pageProperties.page = 0;
    this.paginator.firstPage();
    console.log(this.pageProperties.page);
    this.getPagedEntities();
  }

}
