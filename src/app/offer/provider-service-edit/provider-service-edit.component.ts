import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { Service } from '../model/offer.model';
import { OfferDTO } from '../model/offer.dto';
import { EventService } from '../../event/event.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-provider-service-edit',
  templateUrl: './provider-service-edit.component.html',
  styleUrls: ['./provider-service-edit.component.css']
})
export class ProviderServiceEditComponent implements OnInit {
  serviceForm!: FormGroup;
  offer: Service | null = null;
  eventTypes: string[] = [];
  selectedEventTypes: string[] = [];
  photos: string[] = []
  isFixedDuration: boolean = true; // Default to fixed duration

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private offerService: OfferService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    // Retrieve the offer object passed via Router State
    const navigation = this.router.getCurrentNavigation();
    this.offer = this.offerService.getService();

    if (!this.offer) {
      console.error('No offer found, redirecting to my-services');
      this.router.navigate(['/my-services']);
      return;
    }

    this.fetchEventTypes();

     // Set initial duration type state
     this.isFixedDuration = this.offer.preciseDuration != 0 && this.offer.preciseDuration != null;

     // Pre-select event types if available
    this.selectedEventTypes = [];
    this.offer.eventTypes.forEach(eventType => {this.selectedEventTypes.push(eventType.name)});

    // Initialize the form with default values
    this.serviceForm = this.fb.group({
      name: [this.offer.name, Validators.required],
      description: [this.offer.description, Validators.required],
      specifics: [this.offer.specifics],
      price: [this.offer.price, [Validators.required, Validators.min(0.1)]],
      discount: [this.offer.sale, [Validators.min(0)]],
      visibility: [this.offer.isVisible],
      availability: [this.offer.isAvailable],
      durationType: [this.isFixedDuration ? 'fixed' : 'varied'],
      duration: [this.offer.preciseDuration, [Validators.required, Validators.min(0.1)]],
      minDuration: [this.offer.minDuration, [Validators.required, Validators.min(0.1)]],
      maxDuration: [this.offer.maxDuration, [Validators.required, Validators.min(0.1)]],
      reservationDeadline: [this.offer.latestReservation, [Validators.required, Validators.min(0.1)]],
      cancellationDeadline: [this.offer.latestCancelation, [Validators.required, Validators.min(0.1)]],
      confirmation: [this.offer.isReservationAutoApproved ? 'automatic' : 'manual'],
      eventTypes: [this.selectedEventTypes, this.validateEventTypes()]
    });

    this.photos = this.offer.photos;

    this.onDurationTypeChange(this.isFixedDuration ? 'fixed' : 'varied');
  }

  onPhotoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }
  

  // Navigate back to the services list
  goBack(): void {
    this.router.navigate(['/my-services']);
  }

  // Handle duration type change
  onDurationTypeChange(type: string): void {
    this.isFixedDuration = type === 'fixed';
    this.toggleDurationFields();
  }

  toggleDurationFields(): void {
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
    this.updateDurationValidation();
  }

  updateDurationValidation(): void {
    const isFixed = this.isFixedDuration;
  
    if (isFixed) {
      this.serviceForm.get('duration')?.setValidators([Validators.required, Validators.min(1)]);
      this.serviceForm.get('minDuration')?.clearValidators();
      this.serviceForm.get('maxDuration')?.clearValidators();
    } else {
      this.serviceForm.get('duration')?.clearValidators();
      this.serviceForm.get('minDuration')?.setValidators([Validators.required, Validators.min(1)]);
      this.serviceForm.get('maxDuration')?.setValidators([Validators.required, Validators.min(1)]);
    }
  
    // Update validation state
    this.serviceForm.get('duration')?.updateValueAndValidity();
    this.serviceForm.get('minDuration')?.updateValueAndValidity();
    this.serviceForm.get('maxDuration')?.updateValueAndValidity();
  }
  

  // Handle event type checkbox changes
  onEventTypeChange(eventType: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedEventTypes.push(eventType);
    } else {
      this.selectedEventTypes = this.selectedEventTypes.filter(type => type !== eventType);
    }
    // Update the value and validity of the eventTypes control
    this.serviceForm.get('eventTypes')?.setValue(this.selectedEventTypes);
    this.serviceForm.get('eventTypes')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.serviceForm.valid && this.offer) {
      // Fetch event types based on selected names
      const eventTypeObservables = this.selectedEventTypes.map(name =>
        this.eventService.getEventTypeByName(name)
      );
  
      forkJoin(eventTypeObservables).subscribe({
        next: (eventTypes) => {
          // Create the updated offer payload
          const updatedOffer: OfferDTO = {
            name: this.serviceForm.value.name,
            description: this.serviceForm.value.description,
            specifics: this.serviceForm.value.specifics,
            price: this.serviceForm.value.price,
            sale: this.serviceForm.value.discount,
            isVisible: this.serviceForm.value.visibility,
            isAvailable: this.serviceForm.value.availability,
            type: "Service",
            preciseDuration: this.serviceForm.value.duration || 0,
            minDuration: this.serviceForm.value.minDuration || 0,
            maxDuration: this.serviceForm.value.maxDuration || 0,
            latestReservation: this.serviceForm.value.reservationDeadline,
            latestCancelation: this.serviceForm.value.cancellationDeadline,
            isReservationAutoApproved: this.serviceForm.value.isFixedDuration !== "fixed" && this.serviceForm.value.confirmation === "automatic",
            eventTypes: eventTypes, // Add the fetched event types
            photos: this.photos,
            isDeleted: false,
            category: this.offer.category,
          };
  
          // Call the service to update the offer
          this.offerService.updateService(this.offer.id, updatedOffer).subscribe({
            next: (response) => {
              console.log('Offer updated successfully:', response);
              this.router.navigate(['/my-services']);
            },
            error: (err) => {
              console.error('Error updating offer:', err);
            },
          });
        },
        error: (err) => {
          console.error('Error fetching event types:', err);
        },
      });
    } else {
      console.error('Form is invalid or offer data is missing!');
    }
  }

  validateDuration(): Validators {
    return (control: AbstractControl) => {
      const duration = control.value;
      const minDuration = this.serviceForm?.get('minDuration')?.value;
      const maxDuration = this.serviceForm?.get('maxDuration')?.value;
  
      if (
        (duration === null || duration === 0) &&
        (!minDuration || minDuration <= 0 || !maxDuration || maxDuration <= 0)
      ) {
        return { invalidDuration: true };
      }
      return null;
    };
  }
  

  fetchEventTypes(): void {
    this.eventService.getAllNames().subscribe({
      next: (data) => {
        this.eventTypes = data;
      },
      error: (err) => {
        console.error('Error fetching strings:', err);
      }
    });
  }

  onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file) => {
        this.photos.push(URL.createObjectURL(file)); // Store the temporary URL
      });
    }
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
  }

  validateEventTypes(): Validators {
    return (control: AbstractControl) => {
      const selectedTypes = control.value;
      if (!selectedTypes || selectedTypes.length === 0) {
        return { noEventTypesSelected: true }; // Return error if no types are selected
      }
      return null; // Valid if at least one is selected
    };
  }
  
}
