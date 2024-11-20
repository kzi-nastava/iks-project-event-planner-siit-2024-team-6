import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-provider-service-form',
  templateUrl: './provider-service-form.component.html',
  styleUrl: './provider-service-form.component.css'
})
export class ProviderServiceFormComponent implements OnInit{
  serviceForm!: FormGroup;
  serviceId: string | null = null;
  categories: string[] = ['Catering', 'Decoration', 'Photography'];
  eventTypes: string[] = ['Wedding', 'Birthday', 'Corporate'];
  isFixedDuration: boolean = true; 
  newCategory: string = '';
  selectedEventTypes: string[] = []; 

  constructor(private offerService: OfferService, private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) {}

  goBack(): void {
    this.router.navigate(['/my-services']);
  }

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      specifics: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.min(0)]],
      visibility: [false],
      availability: [true],
      durationType: ['fixed'],
      duration: [{ value: '', disabled: false }],
      minDuration: [{ value: '', disabled: true }],
      maxDuration: [{ value: '', disabled: true }],
      reservationDeadline: [''],
      cancellationDeadline: [''],
      confirmation: [{ value: 'manual', disabled: false }]
    });
    this.selectedEventTypes = [];
  }

  onEventTypeChange(eventType: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
  
    if (isChecked) {
      this.selectedEventTypes.push(eventType);
    } else {
      const index = this.selectedEventTypes.indexOf(eventType);
      if (index > -1) {
        this.selectedEventTypes.splice(index, 1);
      }
    }
  }
  

  proposeCategory(): void {
    this.newCategory = this.serviceForm.get('newCategory')?.value;
    if (this.newCategory.trim()) {
      console.log('Proposed Category:', this.newCategory);
      // Add logic to save the new category
    } else {
      console.error('New category is empty!');
    }
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const formData = {
        ...this.serviceForm.value,
        eventTypes: this.selectedEventTypes // Include selected event types
      };
      console.log('Service Created:', formData);
      this.offerService.addService(formData);
      this.router.navigate(['/my-services']);
    } else {
      console.error('Form is invalid');
    }
  }

  onDurationTypeChange(type: string): void {
    this.isFixedDuration = type === 'fixed';

    if (this.isFixedDuration) {
      // Enable Fixed Duration, Disable Min/Max Duration
      this.serviceForm.get('duration')?.enable();
      this.serviceForm.get('minDuration')?.disable();
      this.serviceForm.get('maxDuration')?.disable();
      this.serviceForm.get('confirmation')?.enable();
    } else {
      // Enable Min/Max Duration, Disable Fixed Duration
      this.serviceForm.get('duration')?.disable();
      this.serviceForm.get('minDuration')?.enable();
      this.serviceForm.get('maxDuration')?.enable();
      this.serviceForm.get('confirmation')?.disable();
    }
  }
}
