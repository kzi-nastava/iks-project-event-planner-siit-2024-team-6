import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NotificationListComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    FormsModule
  ]
})
export class NotificationModule { }
