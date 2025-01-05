import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsViewComponent } from './event/events-view/events-view.component';
import { OffersViewComponent } from './offer/offers-view/offers-view.component';
import { ProviderServiceViewComponent } from './offer/provider-service-view/provider-service-view.component';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { RegistrationComponent } from './infrastructure/auth/registration/registration.component';
import { QuickRegistrationComponent } from './infrastructure/auth/quick-registration/quick-registration.component';
import { ProviderServiceFormComponent } from './offer/provider-service-form/provider-service-form.component';
import { ProviderServiceEditComponent } from './offer/provider-service-edit/provider-service-edit.component';
import { NewEventComponent } from './event/add-event/new-event/new-event.component';
import {AuthGuard} from './infrastructure/auth/auth.guard';
import { ProfileComponent } from './infrastructure/auth/profile/profile.component';
import { ChangePasswordComponent } from './infrastructure/auth/change-password/change-password.component';
import { EventTypeListComponent } from './event/event-type-list/event-type-list.component';
import { EventTypeAddComponent } from './event/event-type-add/event-type-add.component';
import { EventViewComponent } from './event/event-view/event-view.component';
import { OrganizerEventsComponent } from './event/organizer-events/organizer-events.component';
import { EventViewOrgaizerComponent } from './event/event-view-orgaizer/event-view-orgaizer.component';
import { AgendaComponent } from './event/agenda/agenda.component';
import { ActivityFormComponent } from './event/activity-form/activity-form.component';
import { OfferInfoComponent } from './offer/offer-details/offer-info/offer-info.component';
import { FavoriteEventsComponent } from './event/favorite-events/favorite-events.component';
import { AdminCategoryListComponent } from './category/admin-category-list/admin-category-list.component';
const routes: Routes = [
  { path: 'events', component: EventsViewComponent },
  { path: 'offers', component: OffersViewComponent},
  { path: 'my-services', component: ProviderServiceViewComponent , canActivate: [AuthGuard],
    data: {role: 'ROLE_PROVIDER'}},
  { path: 'service-form', component: ProviderServiceFormComponent , canActivate: [AuthGuard],
    data: {role: 'ROLE_PROVIDER'}},
  { path: 'service-edit', component: ProviderServiceEditComponent , canActivate: [AuthGuard],
    data: {role: 'ROLE_PROVIDER'}},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard],
    data: {auser: 'Auth user'}},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard],
    data: {auser: 'Auth user'}},
  {path: 'quick-registration', component: QuickRegistrationComponent},
  {path: 'new-event', component: NewEventComponent , canActivate: [AuthGuard],
    data: {role: 'ROLE_ORGANIZER'}},
  { path: 'event-types', component: EventTypeListComponent , canActivate: [AuthGuard],
    data: {role: 'ROLE_ADMIN'}},
    { path: 'event-types/add', component: EventTypeAddComponent , canActivate: [AuthGuard],
      data: {role: 'ROLE_ADMIN'}},
      { path: 'my_events', component: OrganizerEventsComponent , canActivate: [AuthGuard],
        data: {role: 'ROLE_ORGANIZER'}},
  { path: 'event/:id', component: EventViewComponent },
  { path: 'event/:id/organizer-page', component: EventViewOrgaizerComponent, canActivate: [AuthGuard],
    data: {role: 'ROLE_ORGANIZER'} },
    { path: 'event/:id/agenda', component: AgendaComponent, canActivate: [AuthGuard],
      data: {role: 'ROLE_ORGANIZER'} },
      { path: 'event/:id/add-activity', component: ActivityFormComponent, canActivate: [AuthGuard],
        data: {role: 'ROLE_ORGANIZER'} },
  { path: 'event/:id/edit-activity/:activityId', component: ActivityFormComponent, canActivate: [AuthGuard],
    data: {role: 'ROLE_ORGANIZER'} },
  { path: 'offer/:id', component: OfferInfoComponent },
  { path: 'favorite/events', component: FavoriteEventsComponent, canActivate: [AuthGuard],
    data: {auser: 'Auth user'} },
  {path: 'categories', component: AdminCategoryListComponent, canActivate: [AuthGuard], data: {role: 'ROLE_ADMIN' }},
  { path: '', redirectTo: '/events', pathMatch: 'full' }
];
///event/${this.eventId}/agenda
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
