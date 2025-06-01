import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { TopOfferCardComponent } from './top-offer-card/top-offer-card.component';
import { OfferSliderComponent } from './offer-slider/offer-slider.component';
import { OffersViewComponent } from './offers-view/offers-view.component';
import { OfferCardComponent } from './offer-card/offer-card.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OffersFilterComponent } from './offers-filter/offers-filter.component';
import { OfferDetailsModule } from './offer-details/offer-details.module';
import { ProviderServiceFilterComponent } from './provider-service-filter/provider-service-filter.component';
import { ProviderServiceListComponent } from './provider-service-list/provider-service-list.component';
import { ProviderServiceViewComponent } from './provider-service-view/provider-service-view.component';
import { ProviderOfferCardComponent } from './provider-offer-card/provider-offer-card.component';
import { ProviderServiceFormComponent } from './provider-service-form/provider-service-form.component';
import { ProviderServiceEditComponent } from './provider-service-edit/provider-service-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProviderProductCardComponent } from './provider-product-card/provider-product-card.component';
import { ProviderProductEditComponent } from './provider-product-edit/provider-product-edit.component';
import { ProviderProductFilterComponent } from './provider-product-filter/provider-product-filter.component';
import { ProviderProductFormComponent } from './provider-product-form/provider-product-form.component';
import { ProviderProductViewComponent } from './provider-product-view/provider-product-view.component';
import { ProviderProductListComponent } from './provider-product-list/provider-product-list.component';
import { FavoriteProductsComponent } from './favorite-products/favorite-products.component';
import { FavoriteServicesComponent } from './favorite-services/favorite-services.component';


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
    ProviderServiceEditComponent,
    ProviderProductCardComponent,
    ProviderProductEditComponent,
    ProviderProductFilterComponent,
    ProviderProductFormComponent,
    ProviderProductViewComponent,
    ProviderProductListComponent,
    FavoriteProductsComponent,
    FavoriteServicesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    OfferDetailsModule
  ],
  exports: [
    OfferSliderComponent,
    ProviderServiceViewComponent,
    ProviderProductEditComponent,
    OfferCardComponent
  ]
})
export class OfferModule { }
