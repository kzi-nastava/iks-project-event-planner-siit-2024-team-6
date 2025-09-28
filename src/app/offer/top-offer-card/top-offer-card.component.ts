import { Component,Input } from '@angular/core';
import { Offer } from '../model/offer.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-top-offer-card',
  templateUrl: './top-offer-card.component.html',
  styleUrl: './top-offer-card.component.css'
})
export class TopOfferCardComponent {
  @Input() offer!: Offer;
  constructor(private router: Router) {}
  
    onViewClick() {
      this.router.navigate(['/offer', this.offer.id]);
    }
}
