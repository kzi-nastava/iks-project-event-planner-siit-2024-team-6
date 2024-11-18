import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from './event-card/event-card.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventSliderComponent } from './event-slider/event-slider.component';
import { TopEventCardComponent } from './top-event-card/top-event-card.component';
import { EventsFilterComponent } from './events-filter/events-filter.component';


@NgModule({
  declarations: [
    EventCardComponent,
    EventListComponent,
    EventSliderComponent,
    TopEventCardComponent,
    EventsFilterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EventListComponent,
    EventSliderComponent
  ]
})
export class EventModule { }
