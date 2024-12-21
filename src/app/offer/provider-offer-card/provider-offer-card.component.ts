import { Component, Input } from '@angular/core';
import { Offer, Service } from '../model/offer.model';
import { Route, Router } from '@angular/router';
import { OfferService } from '../offer.service';
@Component({
  selector: 'app-provider-offer-card',
  templateUrl: './provider-offer-card.component.html',
  styleUrl: './provider-offer-card.component.css'
})
export class ProviderOfferCardComponent {
  @Input() offer!: Service;
  constructor(
    private router: Router,
    private dataTransfer: OfferService
  ) {}
  editService(service: Service): void {
    console.log("SERVICE IN EDIT"+ service.name);
    this.dataTransfer.setService(service);
    this.router.navigate(['/service-edit']);
  }
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }  
  
}
