import { Component, Input} from '@angular/core';
import { Offer } from '../model/offer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.css'
})
export class OfferCardComponent {
  @Input() offer!: Offer;

  constructor(private router: Router) {}

  onCardClick() {
    this.router.navigate(['/offer', this.offer.id]);
  }
}
