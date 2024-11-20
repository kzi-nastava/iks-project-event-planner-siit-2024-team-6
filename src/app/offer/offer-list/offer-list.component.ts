import { Component, OnInit } from '@angular/core';
import { OfferService } from '../offer.service';
import { Offer } from '../model/offer.model';
@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.css'
})
export class OfferListComponent implements OnInit {
  offers: Offer[] = [];

  isFilterVisible = false;

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.offers = this.offerService.getAll();
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
}