import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCategoryListComponent } from './admin-category-list/admin-category-list.component';
import { AdminCategoryCardComponent } from './admin-category-card/admin-category-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AdminCategoryListComponent,
    AdminCategoryCardComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  exports:[
    AdminCategoryListComponent,
    AdminCategoryCardComponent
  ]
})
export class CategoryModule { }
