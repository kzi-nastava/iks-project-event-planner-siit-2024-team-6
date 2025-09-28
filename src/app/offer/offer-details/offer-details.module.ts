import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { OfferInfoComponent } from './offer-info/offer-info.component';
import { ReservationComponent } from './reservation/reservation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CompanyDialogComponent } from './company-dialog/company-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BuyDialogComponent } from './buy-dialog/buy-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';


@NgModule({
  declarations: [
    OfferInfoComponent,
    ReservationComponent,
    CompanyDialogComponent,
    BuyDialogComponent,
    ReviewDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  exports: [
    OfferInfoComponent
  ]
})
export class OfferDetailsModule { }
