import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportService } from '../report.service';
import { NewReportDTO } from '../../dto/report-dtos';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
})
export class ReportDialogComponent {
  reportForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reportService: ReportService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.reportForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(1)]],
      // Removed 'type' because there's no input for it in the template
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.reportForm.invalid) return;

    const reportData: NewReportDTO = {
      reason: this.reportForm.get('reason')?.value,
      reportedId: this.data.reportedId,
      reporterId: this.authService.getUserId(),
    };

    this.reportService.reportUser(reportData).subscribe({
      next: (response) => {
        console.log('Report submitted successfully:', response);
        this.dialogRef.close(response);
        this.snackBar.open('Report submitted successfully.', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        console.error('Failed to submit report', err);
        this.errorMessage = 'Failed to submit report. Please try again later.';
        console.log(reportData);
      },
    });
  }
}
