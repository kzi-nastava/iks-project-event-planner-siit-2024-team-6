import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCardComponent } from './category-card/category-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CategorySuggestionCardComponent } from './category-suggestion-card/category-suggestion-card.component';
import { CategorySuggestionListComponent } from './category-suggestion-list/category-suggestion-list.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { SuggestionEditDialogComponent } from './suggestion-edit-dialog/suggestion-edit-dialog.component';


@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryCardComponent,
    CategoryDialogComponent,
    CategorySuggestionCardComponent,
    CategorySuggestionListComponent,
    AdminViewComponent,
    SuggestionEditDialogComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatProgressSpinnerModule
  ],
  exports:[
    CategoryListComponent,
    CategoryCardComponent,
    CategoryDialogComponent
  ]
})
export class CategoryModule { }
