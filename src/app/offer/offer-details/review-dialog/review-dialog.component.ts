import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.css'
})
export class ReviewDialogComponent {
  reviewForm: FormGroup;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reviewForm = this.fb.group({
      comment: [''],
      rating: [null]
    });
    this.reviewForm.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  submit() {
    const { comment, rating } = this.reviewForm.value;

    if (!comment?.trim() && (rating === null || rating === undefined)) {
      // Optionally mark as touched
      this.reviewForm.markAllAsTouched();

      // Show a manual error (you can also use a flag)
      this.errorMessage = 'Please provide at least a comment or a rating.';
      return;
    }

    this.dialogRef.close(this.reviewForm.value);
  }


  cancel() {
    this.dialogRef.close();
  }
}
