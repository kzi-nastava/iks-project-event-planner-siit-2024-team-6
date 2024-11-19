import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-events-filter',
  templateUrl: './events-filter.component.html',
  styleUrls: ['./events-filter.component.css']
})
export class EventsFilterComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  types = [
    { name: 'Birthday' },
    { name: 'Concert' },
    { name: 'Conference' },
  ];

  selectedType:string = '';

  closeFilter() {
    this.isVisible = false;
    this.close.emit();
  }
  
  applyFilters() {
    console.log('Filters applied');
    this.closeFilter();
  }

  resetFilters() {
    console.log('Filters reset');
  }
}
