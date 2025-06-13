import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    NotificationListComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule
  ]
})
export class NotificationModule { }
