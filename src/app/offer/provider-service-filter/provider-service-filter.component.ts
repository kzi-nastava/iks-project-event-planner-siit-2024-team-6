import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-provider-service-filter',
  templateUrl: './provider-service-filter.component.html',
  styleUrl: './provider-service-filter.component.css'
})
export class ProviderServiceFilterComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  categories = [
    { name: 'Food' },
    { name: 'Electronics' },
    { name: 'Gifts' },
    { name: 'Decoration' },
  ];
  eventTypes = [
    { name: 'Birthday' },
    { name: 'Wedding' },
    { name: 'Conference' },
  ];
  selectedCategory: string = '';
  selectedEventType: string = '';
  priceRange: number = 1000;
  isAvailableSelected: boolean = false;

  closeFilter() {
    this.isVisible = false;
    this.close.emit();
  }

  applyFilters() {
    console.log({
      category: this.selectedCategory,
      eventType: this.selectedEventType,
      priceRange: this.priceRange,
      isAvailable: this.isAvailableSelected,
    });
  }

  resetFilters() {
    this.selectedCategory = '';
    this.selectedEventType = '';
    this.priceRange = 1000;
    this.isAvailableSelected = false;
  }
}
