import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { EventModule } from '../event/event.module';
import { OfferModule } from '../offer/offer.module';



@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    FooterComponent
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
    HomeComponent
  ]
})
export class LayoutModule { }
