import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EventTypeService } from '../event-type.service';
import { EventTypeDTO } from '../event-type.service';

@Component({
  selector: 'app-events-filter',
  templateUrl: './events-filter.component.html',
  styleUrls: ['./events-filter.component.css'],
})
export class EventsFilterComponent implements OnInit {
  @Input() isVisible = false;
  @Input() searchQuery: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<any>();

  types: EventTypeDTO[] = [];
  selectedType: string = '';
  fromDate: string = '';
  toDate: string = '';
  today: string = '';

  constructor(private eventTypeService: EventTypeService) {}

  ngOnInit(): void {
    this.loadEventTypes();
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
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

  closeFilter() {
    this.isVisible = false;
    this.close.emit();
  }

  applyFilters() {
    const filters = {
      eventType: this.selectedType,
      startDate: this.fromDate,
      endDate: this.toDate,
      name: this.searchQuery,
      description: this.searchQuery,
      place: this.searchQuery,
    };

    this.apply.emit(filters);
    console.log('Filters applied:', filters);
    this.closeFilter();
  }

  resetFilters() {
    this.selectedType = '';
    this.fromDate = '';
    this.toDate = '';

    this.apply.emit({});
    console.log('Filters reset');
  }
}
