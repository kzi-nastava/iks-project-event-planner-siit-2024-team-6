import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { TopOfferCardComponent } from './top-offer-card/top-offer-card.component';
import { OfferSliderComponent } from './offer-slider/offer-slider.component';
import { OffersViewComponent } from './offers-view/offers-view.component';
import { OfferCardComponent } from './offer-card/offer-card.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OffersFilterComponent } from './offers-filter/offers-filter.component';



@NgModule({
  declarations: [
    TopOfferCardComponent,
    OfferSliderComponent,
    OffersViewComponent,
    OfferCardComponent,
    OfferListComponent,
    OffersFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    OfferSliderComponent
  ]
})
export class OfferModule { }
