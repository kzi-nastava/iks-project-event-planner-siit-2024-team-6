import { Component,Input } from '@angular/core';
import { Offer } from '../model/offer.model';
@Component({
  selector: 'app-top-offer-card',
  templateUrl: './top-offer-card.component.html',
  styleUrl: './top-offer-card.component.css'
})
export class TopOfferCardComponent {
  @Input() offer!: Offer;
}
