import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { EventCardComponent } from './event-card/event-card.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventSliderComponent } from './event-slider/event-slider.component';
import { TopEventCardComponent } from './top-event-card/top-event-card.component';
import { EventsFilterComponent } from './events-filter/events-filter.component';
import { EventsViewComponent } from './events-view/events-view.component';
import { AddEventModule } from './add-event/add-event.module';

import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventTypeListComponent } from './event-type-list/event-type-list.component';
import { EventTypeAddComponent } from './event-type-add/event-type-add.component';
import { RouterModule } from '@angular/router';
import { EventViewComponent } from './event-view/event-view.component';
import { OrganizerEventsComponent } from './organizer-events/organizer-events.component';


@NgModule({
  declarations: [
    EventCardComponent,
    EventListComponent,
    EventSliderComponent,
    TopEventCardComponent,
    EventsFilterComponent,
    EventsViewComponent,
    EventTypeListComponent,
    EventTypeAddComponent,
    EventViewComponent,
    OrganizerEventsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AddEventModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    EventsViewComponent,
    EventTypeListComponent,
    EventTypeAddComponent,
    EventViewComponent
  ]
})
export class EventModule { }
