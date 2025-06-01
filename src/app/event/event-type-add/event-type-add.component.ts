import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-type-add',
  templateUrl: './event-type-add.component.html',
  styleUrl: './event-type-add.component.css'
})
export class EventTypeAddComponent implements OnInit {
  eventTypeForm: FormGroup;
  categories: { id: number; name: string }[] = []; // Список категорий

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.eventTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<{ id: number; name: string }[]>('/api/admins/categoriesNonPaged').subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  onEventType(): void {
    if (this.eventTypeForm.valid) {
      const newEventType = {
        name: this.eventTypeForm.value.name,
        description: this.eventTypeForm.value.description,
        categories: [{ id: this.eventTypeForm.value.category }]
      };

      this.http.post('/api/admins/event-types', newEventType).subscribe({
        next: () => {
          console.log('Event Type added successfully');
          this.router.navigate(['/event-types'])
        },
        error: (err) => {
          console.error('Failed to add Event Type:', err);
        }
      });
    }
  }
}