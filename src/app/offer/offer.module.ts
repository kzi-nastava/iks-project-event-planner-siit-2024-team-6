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
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductsViewComponent } from './product/products-view/products-view.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProviderProductCardComponent } from './product/provider/provider-product-card/provider-product-card.component';
import { ProviderProductEditComponent } from './product/provider/provider-product-edit/provider-product-edit.component';
import { ProviderProductFilterComponent } from './product/provider/provider-product-filter/provider-product-filter.component';
import { ProviderProductFormComponent } from './product/provider/provider-product-form/provider-product-form.component';


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
    ProductCardComponent,
    ProductListComponent,
    ProductsViewComponent,
    ProductDetailsComponent,
    ProviderProductCardComponent,
    ProviderProductEditComponent,
    ProviderProductFilterComponent,
    ProviderProductFormComponent
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
    ProviderServiceViewComponent
  ]
})
export class OfferModule { }
