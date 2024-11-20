import { Component,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-offers-filter',
  templateUrl: './offers-filter.component.html',
  styleUrl: './offers-filter.component.css'
})
export class OffersFilterComponent {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  isProductsSelected: boolean = true;
  isServicesSelected: boolean = false;
  categories = [
    { name: 'Food' },
    { name: 'Electronics' },
    { name: 'Photography' },
  ];
  selectedCategory:string = '';
  priceRange:number = 1000;
  selectedDate:string = '';
  selectedTime:string = '';

  closeFilter() {
    this.isVisible = false;
    this.close.emit();
  }

  applyFilters(){}

  resetFilters() {
    this.isProductsSelected = true;
    this.isServicesSelected = false;
    this.selectedCategory = '';
    this.priceRange = 1000;
    this.selectedDate = '';
    this.selectedTime = '';
  }
}

