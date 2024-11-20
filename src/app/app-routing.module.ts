import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsViewComponent } from './event/events-view/events-view.component';
import { OffersViewComponent } from './offer/offers-view/offers-view.component';
const routes: Routes = [
  { path: 'events', component: EventsViewComponent },
  { path: 'offers', component: OffersViewComponent },
  { path: '', redirectTo: '/events', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
