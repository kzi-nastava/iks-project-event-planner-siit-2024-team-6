import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriceListItem } from '../model/offer.model';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']  // fix typo here
})
export class PriceListComponent implements OnInit {
  products: PriceListItem[] = [];
  services: PriceListItem[] = [];
  loading = true;

  constructor(
    private offerService: OfferService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchPriceList();
  }

  fetchPriceList(): void {
    this.loading = true;

    this.offerService.getPriceList().subscribe({
      next: (items: PriceListItem[]) => {
        this.services = items.filter(item => item.isService);
        this.products = items.filter(item => !item.isService);
        this.loading = false;
        console.log(items);
      },
      error: () => {
        this.snackBar.open('Failed to load price list.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  exportToPDF(): void {
    this.offerService.downloadPriceListPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'price-list.pdf';
        link.click();
        this.snackBar.open('PDF exported successfully.', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to export PDF.', 'Close', { duration: 3000 });
      }
    });
  }
}
