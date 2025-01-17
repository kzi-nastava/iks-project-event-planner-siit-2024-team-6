import { Component, Input } from '@angular/core';
import { Offer } from '../../model/offer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Offer;

  constructor(private router: Router) {}

  onCardClick() {
    this.router.navigate(['/product', this.product.id]);
  }
}
