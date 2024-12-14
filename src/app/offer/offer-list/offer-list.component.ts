import { Component, OnInit } from '@angular/core';
import { OfferService } from '../offer.service';
import { Offer } from '../model/offer.model';
import { PageEvent } from '@angular/material/paginator';
import {PagedResponse} from '../../shared/model/paged-response.model';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.css'
})
export class OfferListComponent implements OnInit {
  offers: Offer[] = [];
  pageProperties = {
    page: 0,
    pageSize: 8,
    totalCount: 0,
    pageSizeOptions: [4, 8, 12]
 };

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

  private getPagedEntities(){
    this.offerService.getAll(this.pageProperties).subscribe({next: (response: PagedResponse<Offer>)=>{
      this.offers = response.content;
      console.log(this.offers[0]);
      this.pageProperties.totalCount = response.totalElements;
    }});
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
}