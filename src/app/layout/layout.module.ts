import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { EventModule } from '../event/event.module';
import { OfferModule } from '../offer/offer.module';
import { MaterialModule } from '../infrastructure/material/material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarOrganizerComponent } from './sidebar-organizer/sidebar-organizer.component';
import { SidebarProviderComponent } from './sidebar-provider/sidebar-provider.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    FooterComponent,
    SidebarComponent,
    SidebarOrganizerComponent,
    SidebarProviderComponent,
    SidebarAdminComponent,
    SidebarUserComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    EventModule,
    OfferModule,
    FullCalendarModule
  ],
  exports: [
    FooterComponent,
    NavBarComponent,
    HomeComponent,
    SidebarComponent,
    CalendarComponent
  ]
})
export class LayoutModule { }
