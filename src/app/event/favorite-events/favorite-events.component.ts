import { Component, ViewChild } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../model/event.model';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PagedResponse } from '../../shared/model/paged-response.model';

@Component({
  selector: 'app-favorite-events',
  templateUrl: './favorite-events.component.html',
  styleUrl: './favorite-events.component.css'
})
export class FavoriteEventsComponent {
  isButtonDisabled: boolean = false;
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

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.getPagedEntities();
  }

  pageChanged(pageEvent: PageEvent){
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }
 private getPagedEntities() {
    const params = {
      ...this.pageProperties,
      ...this.filters,
    };
    console.log("Params: ",params);

    this.eventService.getFilteredFavorites(params).subscribe({
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
