import { Component, Input } from '@angular/core';
import { Offer } from '../model/offer.model';
import { Route, Router } from '@angular/router';
import { OfferService } from '../offer.service';
@Component({
  selector: 'app-provider-offer-card',
  templateUrl: './provider-offer-card.component.html',
  styleUrl: './provider-offer-card.component.css'
})
export class ProviderOfferCardComponent {
  @Input() offer!: Offer;
  constructor(
    private router: Router,
    private dataTransfer: OfferService
  ) {}
  editService(service: Offer): void {
    this.dataTransfer.setService(service);
    this.router.navigate(['/service-form']);
  }
}
