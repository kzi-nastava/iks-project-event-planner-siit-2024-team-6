import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../model/category.model';

@Component({
  selector: 'app-category-card',
  templateUrl: './admin-category-card.component.html',
  styleUrls: ['./admin-category-card.component.css']
})
export class AdminCategoryCardComponent {
  @Input() category!: Category; // Input to receive category data
  @Output() deleteCategory = new EventEmitter<number>(); // Output event for deleting a category
  constructor(
      private snackBar: MatSnackBar,
      private router: Router,
      private categoryService: CategoryService
    ) {}
  onEdit(): void {
    //this.editCategory.emit(this.category.name); // Emit the category name to the parent for editing
  }

  onDelete(id: number): void {
    const snackBarRef = this.snackBar.open(
      'Are you sure you want to delete this offer?',
      'Confirm',
      {
        duration: 5000,
        verticalPosition: 'top', // Moves the snackbar to the top
        horizontalPosition: 'center', // Optional, centers it horizontally
      }
    );// Emit the category name to the parent for deletion
    snackBarRef.onAction().subscribe(() => {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          console.log('Offer deleted successfully.');
          this.deleteCategory.emit(id);
        },
        error: (err) => {
          console.error('Error deleting offer:', err);
        }
      });
    });
  }
}
