import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EventCardComponent } from './event-card/event-card.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventSliderComponent } from './event-slider/event-slider.component';
import { TopEventCardComponent } from './top-event-card/top-event-card.component';
import { EventsFilterComponent } from './events-filter/events-filter.component';
import { EventsViewComponent } from './events-view/events-view.component';

import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    EventCardComponent,
    EventListComponent,
    EventSliderComponent,
    TopEventCardComponent,
    EventsFilterComponent,
    EventsViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule
    
  ],
  exports: [
    EventsViewComponent
  ]
})
export class EventModule { }
