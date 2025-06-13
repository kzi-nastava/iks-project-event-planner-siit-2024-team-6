import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService} from "../auth.service";
import {AuthResponse} from '../model/auth-response.model';
import {Login} from "../model/login.model";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  email: string = '';
  disableEmail: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, // Inject ActivatedRoute to get query parameters
    private snackBar: MatSnackBar

  ) {
    this.loginForm = this.fb.group({
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.disableEmail = params['disableEmail'] === 'true';

      this.loginForm.patchValue({ email: this.email });

      if (this.disableEmail) {
        this.loginForm.get('email')?.disable();
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const login: Login = {
        email: this.loginForm.get('email')?.value || "",
        password: this.loginForm.value.password || ""
      }
      this.authService.login(login).subscribe({
        next: (response: AuthResponse) => {
          localStorage.setItem('user', response.token);
          this.authService.setUser();
          this.authService.saveMuted(response.muted);
          this.router.navigate(['events']);
        },
        error: (error) => {
          if (error.status === 403) {
            const message = error.error?.message || 'You are suspended. Please try again later.';
            this.snackBar.open(message, 'Close', {
              duration: 5000,
              panelClass: ['warning-snackbar']
            });
          } else {
            console.error('Login failed:', error);
          }
        }
      });
    } else {
      console.error('Form is invalid:', this.loginForm.errors);
    }
  }
}
