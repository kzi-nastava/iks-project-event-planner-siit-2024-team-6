import { Component, Input} from '@angular/core';
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

  constructor(private router: Router, private offerService: OfferService, private snackBar: MatSnackBar) {}

  onCardClick() {
    this.router.navigate(['/offer', this.offer.id]);
  }


  manageFavorites(id: number) {
    this.offerService.getFavorites().subscribe((favorites) => {
      const isFavorite = favorites.some(offer => offer.id === id);
  
      if (isFavorite) {
        this.offerService.removeFromFavorites(id).subscribe(() => {
          this.snackBar.open(`Event ${this.offer.name} removed from favorites`, 'Close', {
            duration: 3000,
          });
        });
      } else {
        this.offerService.addToFavorites(id).subscribe(() => {
          this.snackBar.open(`Event ${this.offer.name} added to favorites`, 'Close', {
            duration: 3000,
          });
        });
      }
    });
  }
}
