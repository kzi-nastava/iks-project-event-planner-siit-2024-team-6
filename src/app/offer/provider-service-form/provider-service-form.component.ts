import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-provider-service-form',
  templateUrl: './provider-service-form.component.html',
  styleUrl: './provider-service-form.component.css'
})
export class ProviderServiceFormComponent implements OnInit{

  onEventTypeChange(event: any, index: number) {
    const eventTypesArray = this.serviceForm.get('eventTypes') as FormArray;

    if (event.target.checked) {
      eventTypesArray.push(this.fb.control(this.eventTypes[index]));
    } else {
      const idx = eventTypesArray.controls.findIndex((ctrl) => ctrl.value === this.eventTypes[index]);
      eventTypesArray.removeAt(idx);
    }
  }
  serviceForm!: FormGroup;
  isEditMode: boolean = false; // Flag for create or edit mode
  serviceId: string | null = null;
  categories: string[] = ['Catering', 'Decoration', 'Photography'];
  eventTypes: string[] = ['Wedding', 'Birthday', 'Corporate'];
  isFixedDuration: boolean = true; 
  newCategory: string = '';

  constructor(private offerService: OfferService, private fb: FormBuilder, private router: Router) {}

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
      eventTypes: this.fb.array([]), // FormArray for checkboxes
      visibility: [false],
      availability: [true],
      durationType: ['fixed'],
      duration: [{ value: '', disabled: false }],
      minDuration: [{ value: '', disabled: true }],
      maxDuration: [{ value: '', disabled: true }],
      reservationDeadline: [''],
      cancellationDeadline: [''],
      confirmation: [{ value: 'automatic', disabled: false }]
    });
  
    const service = this.offerService.getService();
    if (service) {
      this.isEditMode = true;
      this.populateForm(service);
      this.offerService.setService(null);
    }
  }
  
  populateForm(service: any): void {
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      category: service.category || 'Decoration',
      durationType: service.durationType || 'fixed',
      duration: service.duration,
      minDuration: service.minDuration,
      maxDuration: service.maxDuration,
      price: service.price,
      discount: service.discount ?? 0,
      visibility: service.visibility ?? false,
      availability: service.availability ?? false,
      confirmation: service.confirmation || "manual",
      photos: service.photos?.length ? service.photos : ['default-image.jpg'], // Default image
      eventTypes: service.eventTypes?.length ? service.eventTypes : ['Wedding']
    });
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
      const formData = { ...this.serviceForm.value, id: this.serviceId };

      if (this.isEditMode) {
        console.log('Service Updated:', formData);
        // Update the service in the backend or state
      } else {
        const newService = { ...this.serviceForm.value };
        this.offerService.addService(newService)
      }

      // Navigate back to the previous page
      this.router.navigate(['/previous-page-route']);
    } else {
      console.log('Form is invalid');
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
