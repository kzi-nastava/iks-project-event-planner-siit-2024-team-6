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



@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    EventModule,
    OfferModule
  ],
  exports: [
    FooterComponent,
    NavBarComponent,
    HomeComponent,
    SidebarComponent
  ]
})
export class LayoutModule { }
