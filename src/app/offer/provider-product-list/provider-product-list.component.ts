import { Component } from '@angular/core';
import { OfferService } from '../offer.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { PagedResponse } from '../../shared/model/paged-response.model';
import { Product } from '../model/offer.model';
@Component({
  selector: 'app-provider-product-list',
  templateUrl: './provider-product-list.component.html',
  styleUrl: './provider-product-list.component.css'
})
export class ProviderProductListComponent {
   offers: Product[] = [];
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
    this.offerService.getAllProviderProducts(this.pageProperties).subscribe({next: (response: PagedResponse<Product>)=>{
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
    this.router.navigate(['/product-form']);
  }
  removeOfferFromList(): void {
    this.getPagedEntities();
  } 
}
