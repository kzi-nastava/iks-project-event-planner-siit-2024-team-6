import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from './event-card/event-card.component';
import { EventListComponent } from './event-list/event-list.component';



@NgModule({
  declarations: [
    EventCardComponent,
    EventListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EventListComponent
  ]
})
export class EventModule { }
