import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isProvider: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registrationForm = this.fb.group({
      name: [''],
      lastname: [''],
      email: [''],
      password: [''],
      address: [''],
      phoneNumber: [''],
      photoUrl: [''],
      role: ['organizer'],
      companyEmail: [''],
      companyName: [''],
      companyAddress: [''],
      description: [''],
      openingTime: [''],
      closingTime: [''],
      companyPhoto: [''],
    });
  }

  toggleProvider(isProvider: boolean): void {
    this.isProvider = isProvider;
    this.registrationForm.patchValue({ role: isProvider ? 'provider' : 'organizer' });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      this.http.post('/api/users', formData).subscribe({
        next: (response) => {
          console.log('Registration successful!', response);
          // Редирект при успешной регистрации
          this.router.navigate(['/login']); // Укажите путь для редиректа
        },
        error: (error) => console.error('Registration failed.', error),
      });
    } else {
      console.log('Form is invalid', this.registrationForm.errors);
    }
  }
}
