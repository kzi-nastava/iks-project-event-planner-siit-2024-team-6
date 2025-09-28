import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-quick-registration',
  templateUrl: './quick-registration.component.html',
  styleUrl: './quick-registration.component.css'
})
export class QuickRegistrationComponent {

  registrationForm: FormGroup;
  eventId: number | null = null;


  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'] || '';
      this.eventId = params['eventId'] ? +params['eventId'] : null;
      if (email) {
        this.registrationForm.patchValue({ email });
        this.registrationForm.get('email')?.disable();
      }
    });
  }


  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        ...this.registrationForm.getRawValue(),
        email: this.registrationForm.get('email')?.value,
        eventId: this.eventId
      };
      console.log(formData);
      this.http.post<string>('/api/users/quick-register', formData).subscribe({
        next: (response: string) => {
          console.log('Registration successful!', response);
          const email = this.registrationForm.get('email')?.value;
          this.router.navigate(['/login'], { queryParams: { email } });
        },
        error: (error) => {
          console.error('Registration failed.', error);
          alert(error.error);
        }
      });
    } else {
      console.log('Form is invalid', this.registrationForm.errors);
    }
  }
}
