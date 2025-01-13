import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category, CategorySuggestion } from '../model/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-suggestion-edit-dialog',
  templateUrl: './suggestion-edit-dialog.component.html',
  styleUrl: './suggestion-edit-dialog.component.css'
})
export class SuggestionEditDialogComponent {
  suggestionForm: FormGroup;
  categories: string[] = [];
  selectedCategory: number | null = null;
  isLoading = true; // To show a loading indicator while fetching categories

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SuggestionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { suggestion: any },
    private categoryService: CategoryService
  ) {
    // Initialize form with the existing suggestion data
    this.suggestionForm = this.fb.group({
      name: [data.suggestion.name, [Validators.required, Validators.minLength(1)]],
      description: [data.suggestion.description, [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Fetch categories when the dialog is initialized
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false; // Stop loading indicator once categories are fetched
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
        this.isLoading = false;
      }
    });
  }

  // Check if the form is valid or an existing category is selected
  formIsValid(): boolean {
    return this.suggestionForm.valid || this.selectedCategory !== null;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.selectedCategory) {
      // Return the selected category ID
      this.dialogRef.close({ selectedCategory: this.selectedCategory });
    } else if (this.suggestionForm.valid) {
      // Return the updated suggestion
      this.dialogRef.close({ updatedSuggestion: this.suggestionForm.value });
    }
  }

  // Handle dialog cancellation
  onCancel(): void {
    this.dialogRef.close(null);
  }
}
