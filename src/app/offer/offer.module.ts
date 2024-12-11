import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { TopOfferCardComponent } from './top-offer-card/top-offer-card.component';
import { OfferSliderComponent } from './offer-slider/offer-slider.component';
import { OffersViewComponent } from './offers-view/offers-view.component';
import { OfferCardComponent } from './offer-card/offer-card.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OffersFilterComponent } from './offers-filter/offers-filter.component';
import { ProviderServiceFilterComponent } from './provider-service-filter/provider-service-filter.component';
import { ProviderServiceListComponent } from './provider-service-list/provider-service-list.component';
import { ProviderServiceViewComponent } from './provider-service-view/provider-service-view.component';
import { ProviderOfferCardComponent } from './provider-offer-card/provider-offer-card.component';
import { ProviderServiceFormComponent } from './provider-service-form/provider-service-form.component';
import { ProviderServiceEditComponent } from './provider-service-edit/provider-service-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    TopOfferCardComponent,
    OfferSliderComponent,
    OffersViewComponent,
    OfferCardComponent,
    OfferListComponent,
    OffersFilterComponent,
    ProviderServiceFilterComponent,
    ProviderServiceListComponent,
    ProviderServiceViewComponent,
    ProviderOfferCardComponent,
    ProviderServiceFormComponent,
    ProviderServiceEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  exports: [
    OfferSliderComponent,
    ProviderServiceViewComponent
  ]
})
export class OfferModule { }
