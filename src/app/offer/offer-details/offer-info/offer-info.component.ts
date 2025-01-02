import { Component } from '@angular/core';
import { Offer } from '../../model/offer.model';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../../offer.service';
import { Service } from '../../model/offer.model';
import { Product } from '../../model/offer.model';
@Component({
  selector: 'app-offer-info',
  templateUrl: './offer-info.component.html',
  styleUrl: './offer-info.component.css'
})
export class OfferInfoComponent {

  offer: Offer | null = null;

  constructor(private route: ActivatedRoute, private offerService: OfferService) {}

  ngOnInit() {
    const offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchOffer(offerId);
  }

  fetchOffer(id: number) {
    this.offerService.getById(id).subscribe((offerData) => {
      this.offer = offerData as Offer & { type: string }; // Assert the additional type property
    });
  }

  isService(offer: Offer): offer is Service {
    return offer.type === 'Service';
  }

  // Type guard to check if offer is a Product
  isProduct(offer: Offer): offer is Product {
    return offer.type === 'Product';
  }

}
