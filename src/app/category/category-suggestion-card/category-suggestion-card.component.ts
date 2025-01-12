import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategorySuggestion } from '../model/category.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-suggestion-card',
  templateUrl: './category-suggestion-card.component.html',
  styleUrl: './category-suggestion-card.component.css'
})
export class CategorySuggestionCardComponent {
  @Input() suggestion!: CategorySuggestion; // Input to receive category data
  @Output() approveSuggestion = new EventEmitter<number>(); // Output for deleting a category
  @Output() updateSuggestion = new EventEmitter<CategorySuggestion>(); // Output for updating a category

  constructor(
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }
  
  onApproveSuggestion(arg0: number) {
    throw new Error('Method not implemented.');
  }
  openSuggestionDialog(arg0: CategorySuggestion) {
    throw new Error('Method not implemented.');
  }
  /*
    openSuggestionDialog(suggestion: CategorySuggestion): void {
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
                duration: 3000,
                verticalPosition: 'top',
              });
            },
            error: (err) => {
              console.error('Error updating category:', err);
              this.snackBar.open('Failed to update category.', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
              });
            },
          });
        }
      });
    }
  
    onApproveSuggestion(id: number): void {
      const snackBarRef = this.snackBar.open(
        'Are you sure you want to delete this category?',
        'Confirm',
        {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
  
      snackBarRef.onAction().subscribe(() => {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            console.log('Category deleted successfully.');
            this.deleteCategory.emit(id); // Emit ID to parent for list update
            this.snackBar.open('Category deleted successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          error: (err) => {
            console.error('Error deleting category:', err);
            this.snackBar.open('Failed to delete category.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
        });
      });
    }*/
}
