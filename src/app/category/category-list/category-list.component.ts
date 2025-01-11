import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Category } from '../model/category.model';
import { CategoryService } from '../category.service';
import { PagedResponse } from '../../shared/model/paged-response.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-admin-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {
  categories: Category[] = [];

  pageProperties = {
    page: 0,
    pageSize: 8,
    totalCount: 0,
    pageSizeOptions: [4, 8, 12],
  };

  constructor(private categoryService: CategoryService, private dialog: MatDialog,  private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getPagedCategories();
  }

  pageChanged(pageEvent: PageEvent): void {
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedCategories();
  }

  private getPagedCategories(): void {
    this.categoryService.getPagedCategories(this.pageProperties.page, this.pageProperties.pageSize).subscribe({next: (response: PagedResponse<Category>)=>{
      this.categories = response.content;
      console.log("kategorije"+this.categories);
      this.pageProperties.totalCount = response.totalElements;
      console.log("fetch"+response);
    },
      error: (err) => console.error(err),});
  }
   onCategoryUpdated(updatedCategory: Category): void {
    const index = this.categories.findIndex((cat) => cat.id === updatedCategory.id);
    if (index > -1) {
      this.categories[index] = updatedCategory;
    }
  }

  onAddClick(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category: null }, // Pass null to indicate new category creation
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.addCategory(result).subscribe({
          next: (newCategory) => {
            this.categories.unshift(newCategory); // Add the new category to the list
            this.snackBar.open('Category created successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          error: (err) => {
            console.error('Error creating category:', err);
            this.snackBar.open('Failed to create category.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }
  
  removeCategoryFromList(id: number): void {
    this.categories = this.categories.filter(category => category.id !== id);
  }  
}
