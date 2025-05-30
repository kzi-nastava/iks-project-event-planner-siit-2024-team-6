import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventTypeDTO, EventTypeService } from '../../event/event-type.service';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-provider-service-filter',
  templateUrl: './provider-service-filter.component.html',
  styleUrl: './provider-service-filter.component.css'
})
export class ProviderServiceFilterComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<any>();

  categories: string[] = [];
  eventTypes: EventTypeDTO[] = [];

  selectedCategory: string = '';
  selectedEventType: string = '';
  isAvailableSelected: boolean = false;
  isOnSale: boolean = false;
  maxPrice: number = 3000;

  constructor(
      private offerService: OfferService,
      private eventTypeService: EventTypeService
    ) {}
  
    ngOnInit(): void {
      this.loadCategories();
      this.loadEventTypes();
    }

  loadEventTypes(): void {
    this.eventTypeService.getAllEventTypes().subscribe(
      (data: EventTypeDTO[]) => {
        this.eventTypes = data;
        console.log('Event types loaded:', data);
      },
      (error) => {
        console.error('Error loading event types:', error);
      }
    );
  }

  loadCategories(): void {
    this.offerService.getAllCategoriesNames().subscribe({
      next: (data: string[]) => {
        this.categories = data;
        console.log('Categories loaded:', data);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  closeFilter() {
    this.isVisible = false;
    this.close.emit();
  }

  applyFilters() {
    const filters = {
      category: this.selectedCategory,
      maxPrice: this.maxPrice,
      eventType: this.selectedEventType,
      isOnSale: this.isOnSale,
      isAvailableSelected: this.isAvailableSelected
    };
    this.apply.emit(filters);
    console.log('Filters applied:', filters);
    this.closeFilter();
  }

  resetFilters() {
    this.selectedCategory = '';
    this.maxPrice = 3000;
    this.selectedEventType = '';
    this.isOnSale = false;
    this.isAvailableSelected = true;
    this.apply.emit({});
    console.log('Filters reset');
  }

}
