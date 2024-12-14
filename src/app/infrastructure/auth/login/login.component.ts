import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.http.post('/api/users/login', loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.status === 401) {
            console.error('Invalid credentials');
          } else if (error.status === 403) {
            console.error('Account is inactive');
          } else {
            console.error('Login failed:', error);
          }
        },
      });
    } else {
      console.error('Form is invalid:', this.loginForm.errors);
    }
  }
}
