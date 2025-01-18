import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product, Service } from '../model/offer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-provider-product-card',
  templateUrl: './provider-product-card.component.html',
  styleUrl: './provider-product-card.component.css'
})
export class ProviderProductCardComponent {
  @Output() deleteproductEvent = new EventEmitter<void>();
  @Input() product!: Product;
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private offerService: OfferService,
    private dialog: MatDialog
  ) { }
  editService(service: Service): void {
    this.offerService.setService(service);
    this.router.navigate(['/service-edit']);
  }

  editProduct(product: Product): void {
    this.offerService.setProduct(product);
    this.router.navigate(['/product-edit']);
  }
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }
  deleteProduct(productId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { question: 'Are you sure you want to delete this product?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.offerService.deleteOffer(productId).subscribe({
          next: () => {
            this.snackBar.open('Product deleted successfully!', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
            this.deleteproductEvent.emit();
          },
          error: (err) => {
            this.snackBar.open('Error when deleting the service, please try again.', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
          }
        });
      } else {
        console.log('User cancelled the action');
      }
    });
  }

}
