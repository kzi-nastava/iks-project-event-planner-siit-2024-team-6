import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quick-registration',
  templateUrl: './quick-registration.component.html',
  styleUrl: './quick-registration.component.css'
})
export class QuickRegistrationComponent {

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      console.log(formData);
      this.http.post('/api/users/quick-register', formData).subscribe({
        next: (response) => console.log('Registration successful!', response),
        error: (error) => console.error('Registration failed.', error),
      });
    } else {
      console.log('Form is invalid', this.registrationForm.errors);
    }
  }
}
