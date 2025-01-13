import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { forkJoin } from 'rxjs';
import { EventService } from '../../event/event.service';
import { NewOfferDTO } from '../../dto/offer-dtos';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDTO } from '../../dto/category-dtos';
import { CategoryDialogComponent } from '../../category/category-dialog/category-dialog.component';

@Component({
  selector: 'app-provider-service-form',
  templateUrl: './provider-service-form.component.html',
  styleUrls: ['./provider-service-form.component.css'],
})
export class ProviderServiceFormComponent implements OnInit {
  serviceForm!: FormGroup;
  categories: string[] = [];
  eventTypes: string[] = [];
  isFixedDuration: boolean = true; // Default to fixed duration
  newCategory: NewCategoryDTO = null;
  selectedEventTypes: string[] = [];
  selectedCategory: string = null;
  photos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private offerService: OfferService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.fetchEventTypes();
    this.fetchCategories();
    this.serviceForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.1)]],
      discount: [null, [Validators.min(0)]],
      duration: [null, [Validators.required, Validators.min(0.1)]],
      minDuration: [null, [Validators.required, Validators.min(0.1)]],
      maxDuration: [null, [Validators.required, Validators.min(0.1)]],
      reservationDeadline: [null, [Validators.required, Validators.min(0.1)]],
      cancellationDeadline: [null, [Validators.required, Validators.min(0.1)]],
      eventTypes: [this.selectedEventTypes, this.validateEventTypes()],
      confirmation: ['automatic'],
      durationType: ['fixed'], // Initialize to 'fixed'
      visibility: [false],
      availability: [false],
      specifics: [''],
      photos:[[]],
      newCategory: [''],
      category: [Validators.required]
    });
    this.isFixedDuration = true;
    this.toggleDurationFields();
  }

  onPhotoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }

  goBack(): void {
    this.router.navigate(['/my-services']);
  }

  onDurationTypeChange(type: string): void {
    this.isFixedDuration = type === 'fixed';
    this.toggleDurationFields();
  }

  toggleDurationFields(): void {
    if (this.isFixedDuration) {
      this.serviceForm.get('duration')?.enable();
      this.serviceForm.get('minDuration')?.disable();
      this.serviceForm.get('maxDuration')?.disable();
      this.serviceForm.get('confirmation')?.enable();
    } else {
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

    this.serviceForm.get('duration')?.updateValueAndValidity();
    this.serviceForm.get('minDuration')?.updateValueAndValidity();
    this.serviceForm.get('maxDuration')?.updateValueAndValidity();
  }

  onEventTypeChange(eventType: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedEventTypes.push(eventType);
    } else {
      this.selectedEventTypes = this.selectedEventTypes.filter((type) => type !== eventType);
    }
    this.serviceForm.get('eventTypes')?.setValue(this.selectedEventTypes);
    this.serviceForm.get('eventTypes')?.updateValueAndValidity();

    this.cdr.detectChanges(); // Trigger change detection manually
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const eventTypeObservables = this.selectedEventTypes.map((name) =>
        this.eventService.getEventTypeByName(name)
      );

      forkJoin(eventTypeObservables).subscribe({
        next: (eventTypes) => {
          const createdOffer: NewOfferDTO = {
            name: this.serviceForm.value.name,
            description: this.serviceForm.value.description,
            specifics: this.serviceForm.value.specifics,
            price: this.serviceForm.value.price,
            sale: this.serviceForm.value.discount,
            isVisible: this.serviceForm.value.visibility,
            isAvailable: this.serviceForm.value.availability,
            type: 'Service',
            preciseDuration: this.serviceForm.value.duration || 0,
            minDuration: this.serviceForm.value.minDuration || 0,
            maxDuration: this.serviceForm.value.maxDuration || 0,
            latestReservation: this.serviceForm.value.reservationDeadline,
            latestCancelation: this.serviceForm.value.cancellationDeadline,
            isReservationAutoApproved: this.serviceForm.value.isFixedDuration !== 'fixed' && this.serviceForm.value.confirmation === 'automatic',
            eventTypes: eventTypes,
            photos: this.photos,
            isDeleted: false,
            category: this.serviceForm.value.category,
            categorySuggestion: this.newCategory,
          };
          console.log(createdOffer);

          this.offerService.createService(createdOffer).subscribe({
            next: (response) => {
              console.log('Offer updated successfully:', response);
              this.router.navigate(['/my-services']);
            },
            error: (err) => {
              console.error('Error creating offer:', err);
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

  fetchEventTypes(): void {
    this.eventService.getAllNames().subscribe({
      next: (data) => {
        this.eventTypes = data; 
      },
      error: (err) => {
        console.error('Error fetching event types:', err);
      },
    });
  }

  fetchCategories(): void{
    this.offerService.getAllCategories().subscribe({
      next: (data) => {
          this.categories = data;
          if (this.categories.length > 0) {
            this.serviceForm.get('category')?.setValue(this.categories[0]);
          }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
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
        return { noEventTypesSelected: true };
      }
      return null;
    };
  }
  proposeCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Proposed Category:', result);
        this.newCategory = result;
      }
    });
  }
}
