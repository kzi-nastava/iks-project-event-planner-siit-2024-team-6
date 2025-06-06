import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OfferService } from '../offer.service';
import { EventTypeService } from '../../event/event-type.service';
import { EventTypeDTO } from '../../event/event-type.service';

@Component({
  selector: 'app-offers-filter',
  templateUrl: './offers-filter.component.html',
  styleUrls: ['./offers-filter.component.css'],
})
export class OffersFilterComponent implements OnInit {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<any>();

  categories: string[] = [];
  types: EventTypeDTO[] = [];
  isProductsSelected: boolean = true;
  isServicesSelected: boolean = true;
  selectedCategory: string = '';
  selectedEventType: string = '';
  isOnSale: boolean = false;
  maxPrice: number = 3000;
//  startDate: string = '';
//  endDate: string = '';

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
        this.types = data;
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
      isProduct: this.isProductsSelected,
      isService: this.isServicesSelected,
      category: this.selectedCategory,
      maxPrice: this.maxPrice,
      //startDate: this.startDate,
      //endDate: this.endDate,
      eventType: this.selectedEventType,
      isOnSale: this.isOnSale,
    };
    this.apply.emit(filters);
    console.log('Filters applied:', filters);
    this.closeFilter();
  }

  resetFilters() {
    this.isProductsSelected = true;
    this.isServicesSelected = true;
    this.selectedCategory = '';
    this.maxPrice = 3000;
    //this.startDate = '';
    //this.endDate = '';
    this.selectedEventType = '';
    this.isOnSale = false;
    this.apply.emit({
      isProduct: true,
      isService: true
    });
    console.log('Filters reset');
  }
}
