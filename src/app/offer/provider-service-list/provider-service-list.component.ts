import { Component } from '@angular/core';
import { OfferService } from '../offer.service';
import { Service } from '../model/offer.model';
import { Router } from '@angular/router';
import { PagedResponse } from '../../shared/model/paged-response.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-provider-service-list',
  templateUrl: './provider-service-list.component.html',
  styleUrl: './provider-service-list.component.css'
})
export class ProviderServiceListComponent {
  services:Service [];
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
    this.getPagedEntities();
  }

  pageChanged(pageEvent: PageEvent){
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }

  private getPagedEntities(){
    this.offerService.getAllProviderServices(1, this.pageProperties).subscribe({next: (response: PagedResponse<Service>)=>{
      this.services = response.content;
      console.log(this.services[0]);
      this.pageProperties.totalCount = response.totalElements;
    }});
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    this.isButtonDisabled = this.isFilterVisible;
  }
  onAddClick(): void {
    this.router.navigate(['/service-form']);
  }
}
