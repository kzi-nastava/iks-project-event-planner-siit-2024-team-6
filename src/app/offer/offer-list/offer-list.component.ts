import { Component, OnInit, ViewChild } from '@angular/core';
import { OfferService } from '../offer.service';
import { Offer } from '../model/offer.model';
import { PageEvent } from '@angular/material/paginator';
import {PagedResponse} from '../../shared/model/paged-response.model';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.css'
})
export class OfferListComponent implements OnInit {
  offers: Offer[] = [];
  filters: any = {
    isProduct: true,
    isService: true
  };
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

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.getPagedEntities();
  }

  pageChanged(pageEvent: PageEvent){
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;

    if (this.isFiltered || this.searchQuery) {
      this.getFilteredEntities();
    } else {
      this.getPagedEntities();
    }
  }

   private getPagedEntities(){
    const params = this.buildQueryParams();
    console.log("Params: ",params);
    this.offerService.getAccepted(params).subscribe({next: (response: PagedResponse<Offer>)=>{
      console.log('Fetch all :', response);
      this.offers = response.content;
      console.log(this.offers[0]);
      this.pageProperties.totalCount = response.totalElements;
    }});
  }
 
  private getFilteredEntities(): void {
    const params = this.buildQueryParams();
    console.log("Params: ",params);

    this.offerService.getFilteredOffers(params).subscribe({
      next: (response: PagedResponse<Offer> | null) => {
        if (response && response.content) {
          console.log('Fetch filter :', response);
          this.offers = response.content;
          this.pageProperties.totalCount = response.totalElements;
          console.log('Paged and filtered offers:', response);
        } else {
          this.offers = [];
          this.pageProperties.totalCount = 0;
          console.warn('No offers found or response is null');
        }
      },
      error: (error) => {
        console.error('Error fetching paged entities:', error);
        this.offers = [];
        this.pageProperties.totalCount = 0;
      },
    });
  }

  onSearch(): void {
    this.filters = {
      name: this.searchQuery,
      description: this.searchQuery,
    };
    this.pageProperties.page = 0;
    this.paginator.firstPage();
    this.getFilteredEntities();
  }

  onFiltersApplied(filters: any): void {
    console.log('Received filters:', filters);
    if (filters.isProduct === undefined) filters.isProduct = true;
    if (filters.isService === undefined) filters.isService = true;
    
    this.isFiltered = !!filters.category ||
                    !!filters.eventType ||
                    filters.isOnSale === true || filters.isOnSale === 'true'
                    filters.isProduct === false ||
                    filters.isService === false ||
                    (filters.minPrice != null && filters.minPrice !== 0) ||
                    (filters.maxPrice != null && filters.maxPrice !== 3000);
    this.filters = filters;
    this.pageProperties.page = 0;
    this.paginator.firstPage();

    if (this.isFiltered) {
    this.getFilteredEntities();
    } else {
      this.getPagedEntities();
    }
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  onSearchChange(query: string) {
  if (!query || query.trim() === '') {
    this.searchQuery = '';
    this.filters = {
      isProduct: true,
      isService: true
    };
    this.isFiltered = false;
    this.pageProperties.page = 0;
    this.paginator.firstPage();
    this.getPagedEntities();
  }
}

onSortChange(sortDirection: string) {
  this.sortDir = sortDirection;
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
    sortBy: 'price',
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