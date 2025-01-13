import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../category.service';
import { Category } from '../model/category.model';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.css'],
})
export class CategoryCardComponent {
  @Input() category!: Category; // Input to receive category data
  @Output() deleteCategory = new EventEmitter<number>(); // Output for deleting a category
  @Output() updateCategory = new EventEmitter<Category>(); // Output for updating a category

  constructor(
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }

  /**
   * Opens a dialog for editing the category.
   * Emits the updated category to the parent component after a successful update.
   */
  openCategoryDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedCategory = { ...category, ...result };
        this.categoryService.updateCategory(category.id, updatedCategory).subscribe({
          next: () => {
            console.log('Category updated successfully.');
            this.updateCategory.emit(updatedCategory); // Emit updated category to parent
            this.snackBar.open('Category updated successfully!', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
          },
          error: (err) => {
            console.error('Error updating category:', err);
            this.snackBar.open('Failed to update category.', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }
  /**
   * Handles the deletion of a category.
   * Emits the category ID to the parent component after confirmation.
   */
  onDeleteCategory(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { question: 'Are you sure you want to delete this category?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User confirmed the action');
        this.categoryService.deleteCategory(id).subscribe({
          next: (response) => {
            this.deleteCategory.emit(id); // Emit ID to parent for list update
            this.snackBar.open('Category deleted successfully!', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
          },
          error: (err) => {
            this.snackBar.open('Failed to delete category. There are offers still using it.', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
          }
        });
      } else {
        console.log('User cancelled the action');
      }
    });
  }
}
