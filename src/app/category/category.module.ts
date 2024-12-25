import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCategoryListComponent } from './admin-category-list/admin-category-list.component';
import { AdminCategoryCardComponent } from './admin-category-card/admin-category-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminCategoryListComponent,
    AdminCategoryCardComponent,
    CategoryDialogComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports:[
    AdminCategoryListComponent,
    AdminCategoryCardComponent,
    CategoryDialogComponent
  ]
})
export class CategoryModule { }
