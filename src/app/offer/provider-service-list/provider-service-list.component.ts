import { Component, ViewChild } from '@angular/core';
import { OfferService } from '../offer.service';
import { Service } from '../model/offer.model';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PagedResponse } from '../../shared/model/paged-response.model';

@Component({
  selector: 'app-provider-service-list',
  templateUrl: './provider-service-list.component.html',
  styleUrl: './provider-service-list.component.css'
})
export class ProviderServiceListComponent {
  offers: Service[] = [];
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
  constructor(private offerService: OfferService, private router: Router) { }
  isButtonDisabled: boolean = false; // Default to enabled

  ngOnInit(): void {
    this.getPagedEntities()
    console.log(this.offers);
  }

  pageChanged(pageEvent: PageEvent) {
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }
  private getPagedEntities() {
    const params = {
      ...this.pageProperties,
      ...this.filters,
    };
    this.offerService.getFilteredProviderServices(params).subscribe({
      next: (response: PagedResponse<Service> | null) => {
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

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    this.isButtonDisabled = this.isFilterVisible;
  }
  onAddClick(): void {
    this.router.navigate(['/service-form']);
  }
  removeOfferFromList(): void {
    this.getPagedEntities();
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
}
