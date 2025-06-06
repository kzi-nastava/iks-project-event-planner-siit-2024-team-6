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
  isFiltered: boolean = false;
  sortDir: string = 'asc';
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

  private getPagedEntities(){
    const params = this.buildQueryParams();
    console.log(params)
    this.eventService.getAll(params).subscribe({next: (response: PagedResponse<Event>)=>{
      console.log('Fetch all :', response);
      this.events = response.content;
      this.pageProperties.totalCount = response.totalElements;
    }});
  }


  private getFilteredEntities() {
    const params = this.buildQueryParams();
    console.log("Params: ",params);
    this.eventService.getFilteredEvents(params).subscribe({
      next: (response: PagedResponse<Event> | null) => {
        if (response && response.content) {
          console.log('Fetch filter :', response);
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
    this.isFiltered = !!filters.eventType || !!filters.startDate || !!filters.endDate;
    this.filters = filters;
    this.pageProperties.page = 0;
    this.paginator.firstPage();

    if (this.isFiltered) {
    this.getFilteredEntities();
    } else {
      this.getPagedEntities();
    }
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
    this.getFilteredEntities();
  }
  onSearchChange(query: string) {
  if (!query || query.trim() === '') {
    this.searchQuery = '';
    this.filters = {};
    this.pageProperties.page = 0;
    this.paginator.firstPage();
    this.getPagedEntities();
  }
}
onSortChange(sortDirection: string) {
  this.filters.sortDir = sortDirection;
  this.pageProperties.page = 0;
  this.paginator.firstPage();

  if (this.isFiltered || this.searchQuery) {
    this.getFilteredEntities();
  } else {
    this.getPagedEntities();
  }
}
private buildQueryParams(): any {
  const params: any = {
    ...this.filters,
    ...this.pageProperties,
    sortBy: 'date',
    sortDir: this.sortDir
  };
  if (typeof this.pageProperties.page === 'number') {
    params.page = this.pageProperties.page;
  }

  if (typeof this.pageProperties.pageSize === 'number') {
    params.size = this.pageProperties.pageSize;
  }
  return params;
}



}
