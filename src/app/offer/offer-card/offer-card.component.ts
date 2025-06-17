import { Component, Input } from '@angular/core';
import { Offer } from '../model/offer.model';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.css'
})
export class OfferCardComponent {
  @Input() offer!: Offer;

  constructor(private router: Router, private offerService: OfferService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadOfferRating(this.offer.id);
  }

  onCardClick() {
    this.router.navigate(['/offer', this.offer.id]);
  }

  offerRating: number | null = null;

  loadOfferRating(offerId: number): void {
    this.offerService.getOfferRating(offerId).subscribe({
      next: (rating) => this.offerRating = rating,
      error: (err) => console.error('Failed to fetch offer rating:', err)
    });
  }
  getDisplayRating(rating: number | null | undefined): string {
    return rating && !isNaN(rating) && rating !== 0 ? rating.toFixed(1) : 'No rating';
  }

}
