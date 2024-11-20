import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-provider-service-edit',
  templateUrl: './provider-service-edit.component.html',
  styleUrls: ['./provider-service-edit.component.css']
})
export class ProviderServiceEditComponent implements OnInit {
  goBack() {
    this.router.navigate(['/my-services']);
  }
  serviceForm!: FormGroup;
  serviceId: string | null = null;
  categories: string[] = ['Catering', 'Decoration', 'Photography'];
  eventTypes: string[] = ['Wedding', 'Birthday', 'Corporate'];
  selectedEventTypes: string[] = []; // Pre-selected event types
  isFixedDuration: boolean = null; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    // Initialize form with empty values
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
      duration: [''],
      minDuration: [''],
      maxDuration: [''],
      reservationDeadline: [''],
      cancellationDeadline: [''],
      confirmation: ['manual']
    });

    this.loadServiceForEdit();
  }

  // Load the service to populate the form
  loadServiceForEdit(): void {
    const service = this.offerService.getService(); // Fetch by ID from your service
    if (service) {
      this.populateForm(service);
      this.offerService.setService(null);
    } else {
      console.error('Service not found!');
      this.router.navigate(['/my-services']); // Redirect if not found
    }
  }

  // Populate the form fields with existing service data
  populateForm(service: any): void {
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      category: service.category,
      specifics: service.specifics,
      price: service.price,
      discount: service.discount,
      visibility: service.visibility,
      availability: service.availability,
      durationType: service.durationType,
      duration: service.duration,
      minDuration: service.minDuration,
      maxDuration: service.maxDuration,
      reservationDeadline: service.reservationDeadline,
      cancellationDeadline: service.cancellationDeadline,
      confirmation: service.confirmation
    });

    // Pre-select event types
    this.selectedEventTypes = service.eventTypes || [];
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

  // Update the service
  onSubmit(): void {
    if (this.serviceForm.valid && this.serviceId) {
      const updatedService = {
        ...this.serviceForm.value,
        id: this.serviceId,
        eventTypes: this.selectedEventTypes // Attach selected event types
      };
      //this.offerService.updateService(updatedService);
      console.log('Service Updated:', updatedService);
      this.router.navigate(['/my-services']);
    } else {
      console.error('Form is invalid or Service ID is missing!');
    }
  }

  // Event Type Selection
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
}
