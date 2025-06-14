import { Component, Input, OnInit } from '@angular/core';
import { PriceListItem } from '../model/offer.model';
import { PriceEditDialogComponent } from '../price-edit-dialog/price-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OfferService } from '../offer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-price-list-table',
  templateUrl: './price-list-table.component.html',
  styleUrls: ['./price-list-table.component.scss']
})
export class PriceListTableComponent implements OnInit {
  @Input() items: PriceListItem[] = [];
  displayedColumns: string[] = ['index', 'name', 'price', 'discountPrice', 'edit'];

  dataSource: PriceListItem[] = [];

  constructor(private dialog: MatDialog, private offerService: OfferService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataSource = this.items;
  }

  ngOnChanges(): void {
    this.dataSource = this.items;
  }

  edit(item: PriceListItem): void {
    console.log('Editing:', item);
    const dialogRef = this.dialog.open(PriceEditDialogComponent, {
      width: '400px',
      data: {
        offerPrice: item.offerPrice,
        offerDiscountPrice: item.offerDiscountPrice
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offerService.updatePrice(item.offerId, {
          price: result.offerPrice,
          salePrice: result.offerDiscountPrice
        }).subscribe({
          next: (updatedItem: PriceListItem) => {
            const index = this.dataSource.findIndex(i => i.offerId === updatedItem.offerId);
            if (index > -1) {
              this.dataSource[index] = updatedItem;
              this.dataSource = [...this.dataSource]; // trigger change detection
            }
            this.snackBar.open('Price updated successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.snackBar.open('Discounted price must be lower than the original', 'Close', {
                duration: 4000,
                panelClass: ['snackbar-error']
              });
            } else {
              this.snackBar.open('Failed to update price. Try again later.', 'Close', {
                duration: 4000,
                panelClass: ['snackbar-error']
              });
            }
          }
        });

      }
    });
  }
}
