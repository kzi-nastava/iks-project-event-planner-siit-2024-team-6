import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [NavBarComponent, SidebarComponent]
})
export class LayoutModule { }
