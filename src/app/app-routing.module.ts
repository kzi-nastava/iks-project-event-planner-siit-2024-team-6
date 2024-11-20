import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsViewComponent } from './event/events-view/events-view.component';
import { OffersViewComponent } from './offer/offers-view/offers-view.component';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { RegistrationComponent } from './infrastructure/auth/registration/registration.component';
const routes: Routes = [
  { path: 'events', component: EventsViewComponent },
  { path: 'offers', component: OffersViewComponent },
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  { path: '', redirectTo: '/events', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
