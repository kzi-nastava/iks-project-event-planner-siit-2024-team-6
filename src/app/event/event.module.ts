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
import { EventTypeListComponent } from './event-type-list/event-type-list.component';
import { EventTypeAddComponent } from './event-type-add/event-type-add.component';
import { RouterModule } from '@angular/router';
import { EventViewComponent } from './event-view/event-view.component';
import { OrganizerEventsComponent } from './organizer-events/organizer-events.component';
import { EventViewOrgaizerComponent } from './event-view-orgaizer/event-view-orgaizer.component';
import { AgendaComponent } from './agenda/agenda.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { FavoriteEventsComponent } from './favorite-events/favorite-events.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BudgetPlanningComponent } from './budget-planning/budget-planning.component';
import { LayoutModule } from "../layout/layout.module";
import { OfferModule } from '../offer/offer.module';
import { BudgetOfferListComponent } from './budget-offer-list/budget-offer-list.component';


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
    OrganizerEventsComponent,
    EventViewOrgaizerComponent,
    AgendaComponent,
    ActivityFormComponent,
    FavoriteEventsComponent,
    BudgetPlanningComponent,
    BudgetOfferListComponent
  ],
  imports: [
    MatPaginatorModule,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    OfferModule
],
  exports: [
    EventsViewComponent,
    EventTypeListComponent,
    EventTypeAddComponent,
    EventViewComponent,
    OrganizerEventsComponent,
    EventViewOrgaizerComponent,
    AgendaComponent,
    ActivityFormComponent
  ]
})
export class EventModule { }
