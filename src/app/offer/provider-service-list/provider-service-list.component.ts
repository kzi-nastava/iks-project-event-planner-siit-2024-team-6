import { Component } from '@angular/core';
import { OfferService } from '../offer.service';
import { Service } from '../model/offer.model';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { PagedResponse } from '../../shared/model/paged-response.model';

@Component({
  selector: 'app-provider-service-list',
  templateUrl: './provider-service-list.component.html',
  styleUrl: './provider-service-list.component.css'
})
export class ProviderServiceListComponent {
   offers: Service[] = [];
    pageProperties = {
      page: 0,
      pageSize: 8,
      totalCount: 0,
      pageSizeOptions: [4, 8, 12]
   };

  isFilterVisible = false;
  constructor(private offerService: OfferService, private router: Router) {}
  isButtonDisabled: boolean = false; // Default to enabled

  ngOnInit(): void {
    this.getPagedEntities()
    console.log(this.offers);
    
  }
  pageChanged(pageEvent: PageEvent){
      this.pageProperties.page = pageEvent.pageIndex;
      this.pageProperties.pageSize = pageEvent.pageSize;
      this.getPagedEntities();
  }
  private getPagedEntities(){
    this.offerService.getAllProviderServices(this.pageProperties).subscribe({next: (response: PagedResponse<Service>)=>{
      this.offers = response.content;
      console.log(this.offers[0]);
      this.pageProperties.totalCount = response.totalElements;
      console.log(response);
    
    },
    error: (err) => console.error(err),});
  }
  
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    this.isButtonDisabled = this.isFilterVisible;
  }
  onAddClick(): void {
    this.router.navigate(['/service-form']);
  }
  removeOfferFromList(offerId: number): void {
    this.offers = this.offers.filter(offer => offer.id !== offerId);
  }  
}
