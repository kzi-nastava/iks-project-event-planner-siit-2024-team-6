import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Offer } from '../../offer/model/offer.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OfferService } from '../../offer/offer.service';
import { PagedResponse } from '../../shared/model/paged-response.model';

@Component({
  selector: 'app-budget-offer-list',
  templateUrl: './budget-offer-list.component.html',
  styleUrl: './budget-offer-list.component.css'
})
export class BudgetOfferListComponent implements OnInit {
  @Input() offers: Offer[] = [];

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    
  }

}