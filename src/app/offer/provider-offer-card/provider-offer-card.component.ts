import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offer, Service } from '../model/offer.model';
import { Route, Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-provider-offer-card',
  templateUrl: './provider-offer-card.component.html',
  styleUrl: './provider-offer-card.component.css'
})
export class ProviderOfferCardComponent {
  @Output() deleteOfferEvent = new EventEmitter<number>();
  @Input() offer!: Service;
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private offerService: OfferService
  ) {}
  editService(service: Service): void {
    this.offerService.setService(service);
    this.router.navigate(['/service-edit']);
  }
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }  
  deleteService(offerId: number): void {
    const snackBarRef = this.snackBar.open(
      'Are you sure you want to delete this offer?',
      'Confirm',
      {
        duration: 5000,
        verticalPosition: 'top', // Moves the snackbar to the top
        horizontalPosition: 'center', // Optional, centers it horizontally
      }
    );
  
    snackBarRef.onAction().subscribe(() => {
      this.offerService.deleteOffer(offerId).subscribe({
        next: () => {
          console.log('Offer deleted successfully.');
          this.deleteOfferEvent.emit(offerId);
        },
        error: (err) => {
          console.error('Error deleting offer:', err);
        }
      });
    });
  }
  
}
