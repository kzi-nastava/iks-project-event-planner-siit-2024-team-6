import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule, 
    FormsModule
  ],
  exports: [
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    ChangePasswordComponent
  ]
})
export class AuthModule { }
