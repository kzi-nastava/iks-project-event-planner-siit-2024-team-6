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

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.getPagedEntities();
  }

  pageChanged(pageEvent: PageEvent){
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }

 /*  private getPagedEntities(){
    this.offerService.getAll(this.pageProperties).subscribe({next: (response: PagedResponse<Offer>)=>{
      this.offers = response.content;
      console.log(this.offers[0]);
      this.pageProperties.totalCount = response.totalElements;
    }});
  }
 */
  private getPagedEntities(): void {
    const params = {
      ...this.pageProperties,
      ...this.filters,
    };
    console.log("Params: ",params);

    this.offerService.getFilteredOffers(params).subscribe({
      next: (response: PagedResponse<Offer> | null) => {
        if (response && response.content) {
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
    this.getPagedEntities();
  }

  onFiltersApplied(filters: any): void {
    console.log('Received filters:', filters);
    this.filters = filters;
    this.pageProperties.page = 0;
    this.paginator.firstPage();
    this.getPagedEntities();
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
}