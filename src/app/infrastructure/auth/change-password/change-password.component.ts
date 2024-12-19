import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPasswordFirst: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordSecond: ['', Validators.required]
    });
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.snackBar.open('Please fill out all fields correctly.', 'Close', {
        duration: 3000
      });
      return;
    }

    const { oldPassword, newPasswordFirst, newPasswordSecond } = this.changePasswordForm.value;

    this.http
      .put('/api/users/profile/password-change', {
        oldPassword,
        newPasswordFirst,
        newPasswordSecond
      }, { responseType: 'text' }) // Указываем, что ожидаем текстовый ответ
      .subscribe({
        next: (response: string) => {
          this.snackBar.open(response || 'Password changed successfully!', 'Close', {
            duration: 3000
          });
          this.changePasswordForm.reset();
          this.router.navigate(['/profile']);
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error || 'An unexpected error occurred.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000
          });
        }
      });
  }
}
