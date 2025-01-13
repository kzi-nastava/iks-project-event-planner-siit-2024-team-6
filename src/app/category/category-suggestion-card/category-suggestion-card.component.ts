import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategorySuggestion } from '../model/category.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../category.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { SuggestionEditDialogComponent } from '../suggestion-edit-dialog/suggestion-edit-dialog.component';
import { ReloadService } from '../../shared/services/reload.service';

@Component({
  selector: 'app-category-suggestion-card',
  templateUrl: './category-suggestion-card.component.html',
  styleUrl: './category-suggestion-card.component.css'
})
export class CategorySuggestionCardComponent {
  @Input() suggestion!: CategorySuggestion; // Input to receive category data
  @Output() approvedSuggestion = new EventEmitter<number>(); // Output for removing suggestion

  constructor(
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private reloadService: ReloadService
  ) { }

  onApproveSuggestion(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { question: 'Are you sure you want to approve this suggestion?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User confirmed the action');
        this.categoryService.approveSuggestion(id).subscribe({
          next: (response) => {
            this.approvedSuggestion.emit(id);
            this.reloadService.emitReload('admin-categories');
            this.snackBar.open("You have successfully approved the category suggestion.", 'Close', {
              duration: 5000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'] // Custom style for error
            });
          },
          error: (err) => {
            this.snackBar.open(err, 'Close', {
              duration: 5000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'] // Custom style for error
            });
          }
        });
      } else {
        console.log('User cancelled the action');
      }
    });
  
  }
  openSuggestionDialog() {
    const dialogRef = this.dialog.open(SuggestionEditDialogComponent, {
      width: '500px',
      data: { suggestion: this.suggestion }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.selectedCategory) {
          this.categoryService.rejectCategorySuggestion(this.suggestion.id, result.selectedCategory).subscribe({
            next: (response) => {
              this.approvedSuggestion.emit(this.suggestion.id);
              this.snackBar.open('Suggestion rejected successfully.', 'Close', {
                duration: 5000,
                verticalPosition: 'top'
              });
              // Optionally reload the list or remove the rejected suggestion from the list
            },
            error: (err) => {
              console.error('Failed to reject suggestion:', err);
              this.snackBar.open('Failed to reject suggestion. Please try again.', 'Close', {
                duration: 5000,
                verticalPosition: 'top'
              });
            }
          });
        } else if (result.updatedSuggestion) {
          console.log('Updated suggestion:', result.updatedSuggestion);
          this.categoryService.updateCategorySuggestion(this.suggestion.id, result.updatedSuggestion).subscribe({
            next: (response) => {
              this.approvedSuggestion.emit(this.suggestion.id);
              this.reloadService.emitReload('admin-categories');
              this.snackBar.open("Suggestion updated and approved successfully!", 'Close', {
                duration: 5000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['success-snackbar'] // Custom style for error
              });
            },
            error: (err) => {
              this.snackBar.open("Failed to update the suggestion. Please try again.", 'Close', {
                duration: 5000, // Duration in milliseconds
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar'] // Custom style for error
              });
            }
          });
        }
      }
    });
  }
}
