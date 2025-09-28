import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offer, Service } from '../model/offer.model';
import { Route, Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-provider-offer-card',
  templateUrl: './provider-offer-card.component.html',
  styleUrl: './provider-offer-card.component.css'
})
export class ProviderOfferCardComponent {
  @Output() deleteOfferEvent = new EventEmitter<void>();
  @Input() offer!: Service;
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private offerService: OfferService,
    private dialog: MatDialog
  ) { }
  offerRating: number | null = null;

  ngOnInit(): void {
    this.loadOfferRating(this.offer.id);
  }
  editService(service: Service): void {
    this.offerService.setService(service);
    this.router.navigate(['/service-edit']);
  }
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }
  deleteService(offerId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { question: 'Are you sure you want to delete this offer?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.offerService.deleteOffer(offerId).subscribe({
          next: () => {
            this.snackBar.open('Service deleted successfully!', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
            this.deleteOfferEvent.emit();
          },
          error: (err) => {
            if (err.status === 400) {
              this.snackBar.open('Future reservations for this service exist. Delete unavailable.', 'Close', {
                duration: 5000,
                verticalPosition: 'top',
              });
            } else {
              this.snackBar.open('Error when deleting the service, please try again.', 'Close', {
                duration: 5000,
                verticalPosition: 'top',
              });
            }
          }
        });
      }
    });
  }

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
